import { Module } from '@nestjs/common';
import { SaqueController } from './saque.controller';
import { SaqueService } from './saque.service';
import { SaqueCronService } from '../cron/saque-cron.service'; // 👈 importa o serviço

@Module({
  controllers: [SaqueController],
  providers: [SaqueService, SaqueCronService]
})

export class SaqueModule {}
