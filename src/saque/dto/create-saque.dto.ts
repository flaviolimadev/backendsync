import { IsString, IsUUID, IsNumber, IsIn } from 'class-validator';

export class CreateSaqueDto {
  @IsUUID()
  profile_id: string;

  @IsNumber()
  value: number;

  @IsIn([1, 2]) // 1 = pix, 2 = usdt
  type: number;

  @IsString()
  carteira: string;
}
