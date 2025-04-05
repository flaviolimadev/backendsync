import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BonusService {
  private supabase;

  // Porcentagens de comissão por nível
  private porcentagens = {
    1: 12,
    2: 4,
    3: 2,
    4: 1,
    5: 1,
  };

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) throw new Error('SUPABASE_URL ou SUPABASE_KEY ausentes');
    this.supabase = createClient(url, key);
  }

  @Cron('*/1 * * * *') // Executa a cada 1 minuto
  async gerarBonusMultinivel() {
    const { data: depositos, error } = await this.supabase
      .from('depositos')
      .select('id, profile_id, value')
      .eq('status', 1);

    if (error) throw new Error(error.message);
    const timestamp = new Date().toISOString();

    for (const deposito of depositos) {
      let userId = deposito.profile_id;
      let depositoId = deposito.id;
      let valorDeposito = deposito.value;
      let nivel = 1;

      while (nivel <= 5) {
        // Busca o usuário que fez o depósito
        const { data: user } = await this.supabase
          .from('profiles')
          .select('referred_by')
          .eq('id', userId)
          .single();

        if (!user?.referred_by) break; // se não há quem indicou, fim da bonificação

        const refId = user.referred_by;
        const percentual = this.porcentagens[nivel];
        const comissao = Math.floor(valorDeposito * (percentual / 100));
        const tipo = nivel === 1 ? 2 : 3;

        // Buscar nome do usuário que depositou para usar na descrição
        const { data: quemDepositou } = await this.supabase
          .from('profiles')
          .select('first_name')
          .eq('id', deposito.profile_id)
          .single();

        const nomeUsuario = quemDepositou?.first_name ?? 'usuário desconhecido';

        // Criar extrato
        await this.supabase.from('extrato').insert([
          {
            profile_id: refId,
            profile_ref: userId,
            value: comissao,
            type: tipo,
            status: 1,
            descricao: `Bônus nível ${nivel} gerado pelo depósito de ${nomeUsuario}`,
            created_at: timestamp,
            updated_at: timestamp,
          },
        ]);

        // Atualizar saldo do referido
        const { data: saldoAtual } = await this.supabase
          .from('profiles')
          .select('balance')
          .eq('id', refId)
          .single();

        await this.supabase
          .from('profiles')
          .update({ balance: saldoAtual.balance + comissao })
          .eq('id', refId);

        userId = refId;
        nivel++;
      }

      // Finaliza o processamento do depósito
      await this.supabase
        .from('depositos')
        .update({ status: 2, updated_at: timestamp })
        .eq('id', depositoId);
    }

    console.log(`[Cron] Bonificações processadas às ${new Date().toLocaleString()}`);
  }
}
