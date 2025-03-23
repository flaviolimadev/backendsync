import { Injectable, Logger } from '@nestjs/common';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class RendimentoService {
  private readonly logger = new Logger(RendimentoService.name);

  async aplicarRendimento(operacaoId: string) {
    this.logger.log(`📈 Aplicando rendimento baseado na operação ${operacaoId}`);

    const { data: operacao, error: operacaoError } = await supabase
      .from('operacoes')
      .select('lucro')
      .eq('id', operacaoId)
      .single();

    if (operacaoError || !operacao) {
      throw new Error('Operação não encontrada');
    }

    const percentualStr = operacao.lucro.replace('%', '').trim();
    const percentual = parseFloat(percentualStr);

    const { data: automacoes, error: autoError } = await supabase
      .from('automacao')
      .select('*')
      .eq('type', 1)
      .eq('status', 1);

    if (autoError) {
      throw new Error('Erro ao buscar automações');
    }

    const hoje = new Date();
    hoje.setUTCHours(0, 0, 0, 0);
    const hojeISOString = hoje.toISOString();

    for (const auto of automacoes) {
      const rendimentoCentavos = Math.round((auto.value * percentual) / 100);

      const { data: rendimentosHoje } = await supabase
        .from('rendimento')
        .select('value')
        .eq('automacao_id', auto.id)
        .gte('created_at', hojeISOString);

      const totalHoje = rendimentosHoje?.reduce((sum, r) => sum + r.value, 0) || 0;
      const limiteDiario = Math.round(auto.value * 0.015);

      if (totalHoje + rendimentoCentavos > limiteDiario) {
        this.logger.warn(`⚠️ Automação ${auto.id} excede limite diário de 1.5%`);
        continue;
      }

      const { data: novoRendimento, error: erroRend } = await supabase.from('rendimento').insert({
        profile_id: auto.profile_id,
        automacao_id: auto.id,
        operacao_id: operacaoId,
        value: rendimentoCentavos,
        type: 0,
        status: 1,
        descricao: `Rendimento automático de ${percentualStr}% aplicado`,
      }).select().single();

      if (erroRend) {
        this.logger.error(`❌ Erro ao salvar rendimento para automação ${auto.id}`);
        continue;
      }

      await supabase.from('extrato').insert({
        profile_id: auto.profile_id,
        value: rendimentoCentavos,
        type: 1,
        status: 1,
        descricao: `Rendimento diário aplicado (${percentualStr}%)`,
        profile_ref: auto.profile_id,
      });

      // Atualizar saldo do usuário
      await supabase.rpc('incrementar_balance', {
        uid: auto.profile_id,
        quantia: rendimentoCentavos,
      });

      this.logger.log(`✅ Rendimento e extrato registrados para automação ${auto.id} - $${(rendimentoCentavos / 100).toFixed(2)}`);
    }

    return { message: 'Rendimentos e extratos aplicados com sucesso.' };
  }

  async processarRendimentoTipo2(operacao_id: string) {
    this.logger.log('📈 Processando rendimentos para automações com type = 2...');

    const { data: automacoes, error } = await supabase
      .from('automacao')
      .select('*')
      .eq('type', 2)
      .eq('status', 1);

    if (error || !automacoes) {
      this.logger.error('❌ Erro ao buscar automações');
      return;
    }

    for (const automacao of automacoes) {
      try {
        const ciclo = automacao.ciclo;
        const porcentagem = ciclo >= 1 && ciclo <= 6 ? ciclo : 0;

        const rendimento = Math.round((automacao.value * porcentagem) / 100);

        const hoje = new Date().toISOString().split('T')[0];
        const { data: rendimentosDia } = await supabase
          .from('rendimento')
          .select('value')
          .eq('automacao_id', automacao.id)
          .gte('created_at', `${hoje}T00:00:00`)
          .lt('created_at', `${hoje}T23:59:59`);

        const totalDia = rendimentosDia?.reduce((acc, r) => acc + r.value, 0) || 0;
        const limite = Math.round(automacao.value * 0.015);

        if (totalDia + rendimento > limite) {
          this.logger.warn(`⚠️ Limite diário já atingido para automação ${automacao.id}`);
          continue;
        }

        await supabase.from('rendimento').insert({
          profile_id: automacao.profile_id,
          automacao_id: automacao.id,
          operacao_id,
          value: rendimento,
          type: 1,
          status: 1,
          descricao: `Rendimento de ${porcentagem}% via ciclo`,
        });

        await supabase.from('extrato').insert({
          profile_id: automacao.profile_id,
          value: rendimento,
          type: 1,
          status: 1,
          descricao: `Rendimento automático de ${porcentagem}% via ciclo`,
          profile_ref: automacao.profile_id,
        });

        await supabase.rpc('incrementar_balance', {
          uid: automacao.profile_id,
          quantia: rendimento,
        });

        this.logger.log(`✅ Rendimento aplicado: ${rendimento} cents para automação ${automacao.id}`);
      } catch (err) {
        this.logger.error(`❌ Erro ao processar automação ${automacao.id}: ${err.message}`);
      }
    }

    return { message: 'Rendimentos aplicados com base no ciclo das automações.' };
  }
}