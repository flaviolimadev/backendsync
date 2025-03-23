import { IsUUID, IsInt, IsIn } from 'class-validator';

export class CreateAutomacaoDto {
  @IsUUID()
  profile_id: string;

  @IsInt()
  value: number;

  @IsIn([1, 2])
  type: number;
}
