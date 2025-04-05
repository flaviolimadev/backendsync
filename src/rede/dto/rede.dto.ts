import { IsUUID } from 'class-validator';

export class RedeDto {
  @IsUUID()
  profile_id: string;
}
