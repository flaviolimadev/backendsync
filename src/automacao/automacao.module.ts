import { Module } from '@nestjs/common';
import { AutomacaoService } from './automacao.service';
import { AutomacaoController } from './automacao.controller';

@Module({
  controllers: [AutomacaoController],
  providers: [AutomacaoService],
})
export class AutomacaoModule {}
