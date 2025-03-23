import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class OperacoesService {
  private readonly logger = new Logger(OperacoesService.name);

  async sincronizarOperacoes() {
    try {
      this.logger.log('🔄 Sincronizando operações de arbitragem...');

      // 1. Faz a requisição para API externa
      const { data: oportunidades } = await axios.get(
        'https://backend.criptexhub.pro/api/arbitrage/oportunidades-arbitragem'
      );

      const agora = new Date();

      // 2. Atualiza ou insere dados
      for (const item of oportunidades) {
        const {
          Moeda,
          Compra,
          Venda,
          Precing_Compra,
          Precing_Venda,
          Spread,
          link_01,
          link_02,
        } = item;

        // Verifica se a operação já existe
        const { data: existente } = await supabase
          .from('operacoes')
          .select('id')
          .eq('ativo', Moeda)
          .eq('compra', Compra)
          .eq('venda', Venda)
          .maybeSingle();

        if (existente) {
          await supabase
            .from('operacoes')
            .update({
              preco_compra: Precing_Compra,
              preco_venda: Precing_Venda,
              lucro: Spread,
              link_compra: link_01,
              link_venda: link_02,
              updated_at: agora,
              status: 1,
            })
            .eq('id', existente.id);
        } else {
          await supabase.from('operacoes').insert({
            ativo: Moeda,
            compra: Compra,
            venda: Venda,
            preco_compra: Precing_Compra,
            preco_venda: Precing_Venda,
            lucro: Spread,
            link_compra: link_01,
            link_venda: link_02,
            created_at: agora,
            updated_at: agora,
            status: 1,
          });
        }
      }

      // 3. Desativa registros não atualizados na última 1h
      const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);
      await supabase
        .from('operacoes')
        .update({ status: 0 })
        .lt('updated_at', umaHoraAtras);

      this.logger.log('✅ Sincronização finalizada.');
    } catch (error) {
      this.logger.error('❌ Erro ao sincronizar operações:', error.message);
    }
  }
}
