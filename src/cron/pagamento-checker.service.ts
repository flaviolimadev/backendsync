import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { supabase } from '../supabase/supabase.service';
import axios from 'axios';

@Injectable()
export class PagamentoCheckerService {
  private readonly logger = new Logger(PagamentoCheckerService.name);

  async generateToken(): Promise<string> {
    const url = 'https://api.primepag.com.br/auth/generate_token';

    const headers = {
      Authorization:
        'ODE2NTliNjctNzQ5Zi00NDFjLTgwNDAtMjY1NzM2YTA1NDFkOmRmOGYwN2JjLWFjZWYtNDgxNi1iYTQ3LTliZWU5OTc3NDdlYQ==',
      'Content-Type': 'application/json',
    };

    const response = await axios.post(url, { grant_type: 'client_credentials' }, { headers });
    return response.data.access_token;
  }

  @Cron('*/30 * * * * *') // A cada 30 segundos
  async verificarDepositos() {
    this.logger.log('⏳ Verificando depósitos pendentes...');

    const { data: depositos, error } = await supabase
      .from('depositos')
      .select('id, txid, created_at, profile_id, value')
      .eq('status', 0)
      .eq('type', 1);

    if (error || !depositos) {
      this.logger.error('Erro ao buscar depósitos pendentes');
      return;
    }

    const token = await this.generateToken();

    for (const deposito of depositos) {
      try {
        const criadoEm = new Date(deposito.created_at);
        const agora = new Date();
        const diffMs = agora.getTime() - criadoEm.getTime();
        const diffHoras = diffMs / (1000 * 60 * 60);

        // Se passou de 24 horas
        if (diffHoras > 24) {
          await supabase
            .from('depositos')
            .update({ status: 3 })
            .eq('id', deposito.id);
          this.logger.log(`❌ Depósito expirado: ${deposito.txid}`);
          continue;
        }

        // Verifica status na API
        const url = `https://api.primepag.com.br/v1/pix/qrcodes/${deposito.txid}`;
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.get(url, { headers });
        const statusPix = response.data?.qrcode?.status;

        if (statusPix === 'paid') {
            // Atualiza o status do depósito
            await supabase
              .from('depositos')
              .update({ status: 1 })
              .eq('id', deposito.id);
          
            // Cria o extrato
            await supabase.from('extrato').insert({
              profile_id: deposito.profile_id,
              value: deposito.value,
              type: 0,
              status: 1,
              descricao: 'Depósito confirmado via Pix',
              profile_ref: deposito.profile_id,
            });

            // Atualiza o balance_invest do usuário
            const { data: perfil, error: perfilError } = await supabase
            .from('profiles')
            .select('balance_invest')
            .eq('id', deposito.profile_id)
            .single();

            if (!perfilError && perfil) {
            const novoBalance = (perfil.balance_invest || 0) + deposito.value;

            await supabase
            .from('profiles')
            .update({ balance_invest: novoBalance })
            .eq('id', deposito.profile_id);

            this.logger.log(`💰 Balance_invest atualizado para usuário ${deposito.profile_id}`);
            }

          
            this.logger.log(`✅ Pagamento confirmado e extrato registrado: ${deposito.txid}`);
          }
      } catch (err) {
        this.logger.warn(`Erro ao verificar txid ${deposito.txid}`);
      }
    }
  }
}
