import { Module } from '@nestjs/common';
import { OperacoesService } from './operacoes.service';
import { OperacoesController } from './operacoes.controller';

@Module({
  providers: [OperacoesService],
  controllers: [OperacoesController]
})
export class OperacoesModule {}
