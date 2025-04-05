import { Module } from '@nestjs/common';
import { RedeService } from './rede.service';
import { RedeController } from './rede.controller';

@Module({
  controllers: [RedeController],
  providers: [RedeService],
})
export class RedeModule {}
