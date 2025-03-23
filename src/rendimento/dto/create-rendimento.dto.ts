import { IsUUID } from 'class-validator';

export class CreateRendimentoDto {
  @IsUUID()
  operacao_id: string;
}
