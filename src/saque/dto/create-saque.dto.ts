import { IsUUID, IsNumber, IsIn, IsString, Length } from 'class-validator';

export class CreateSaqueDto {
  @IsUUID()
  profile_id: string;

  @IsNumber()
  value: number;

  @IsIn([1, 2]) // 1 = PIX, 2 = USDT
  type: number;

  @IsString()
  carteira: string;

  @IsString()
  @Length(11, 11) // CPF sem pontos ou traços
  cpf: string;
}
