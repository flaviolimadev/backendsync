import { Module } from '@nestjs/common';
import { RendimentoService } from './rendimento.service';
import { RendimentoController } from './rendimento.controller';

@Module({
  providers: [RendimentoService],
  controllers: [RendimentoController]
})
export class RendimentoModule {}
