import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';

@Module({
  providers: [BonusService],
})
export class CronModule {}
