import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSaqueDto } from './dto/create-saque.dto';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class SaqueService {
  async solicitarSaque(dto: CreateSaqueDto) {
    // 1. Verificar valor mínimo
    if (dto.value < 1000) {
      throw new BadRequestException('O valor mínimo para saque é de $10 (1000).');
    }

    // 2. Buscar saldo do usuário
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', dto.profile_id)
      .single();

    if (userError || !user) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    // 3. Verificar saldo suficiente
    if (user.balance < dto.value) {
      throw new BadRequestException('Saldo insuficiente para realizar o saque.');
    }

    // 4. Inserir saque
    const { data: saque, error: saqueError } = await supabase.from('saques').insert({
      profile_id: dto.profile_id,
      value: dto.value,
      type: dto.type,
      status: 0,
      carteira: dto.carteira,
      bonus: false,
      descricao: 'Solicitação de saque',
    }).select('id').single();

    if (saqueError) {
      throw new Error(`Erro ao solicitar saque: ${saqueError.message}`);
    }

    // 6. Atualizar saldo do usuário
    const { error: updateBalanceError } = await supabase
      .from('profiles')
      .update({ balance: user.balance - dto.value })
      .eq('id', dto.profile_id);

    if (updateBalanceError) {
      throw new Error(`Erro ao debitar saldo: ${updateBalanceError.message}`);
    }

    return { message: 'Saque solicitado e saldo debitado com sucesso!' };
  }
}
