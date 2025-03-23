import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.service';
import { CreateAutomacaoDto } from './dto/create-automacao.dto';

@Injectable()
export class AutomacaoService {
  async criarAutomacao(dto: CreateAutomacaoDto) {
    if (dto.value < 1000) {
      throw new BadRequestException('O valor mínimo para criar uma automação é $10 (1000).');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance_invest')
      .eq('id', dto.profile_id)
      .single();

    if (profileError || !profile) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    if (profile.balance_invest < dto.value) {
      throw new BadRequestException('Saldo insuficiente em balance_invest.');
    }

    const ciclo = dto.type === 1 ? 0 : dto.type === 2 ? 1 : null;

    if (ciclo === null) {
      throw new BadRequestException('Tipo de automação inválido.');
    }

    // Criar automação
    const { error: insertError } = await supabase.from('automacao').insert({
      profile_id: dto.profile_id,
      value: dto.value,
      type: dto.type,
      status: 1,
      ciclo: ciclo,
    });

    if (insertError) {
      throw new BadRequestException(`Erro ao criar automação: ${insertError.message}`);
    }

    // Debitar saldo investido
    const { error: updateError } = await supabase.rpc('debitar_balance_invest', {
      uid: dto.profile_id,
      quantia: dto.value,
    });

    if (updateError) {
      throw new BadRequestException(`Erro ao debitar saldo: ${updateError.message}`);
    }

    return { message: 'Automação criada com sucesso!' };
  }
}
