import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';
import { PagamentoCheckerService } from '../cron/pagamento-checker.service';

@Module({
  providers: [PagamentoService, PagamentoCheckerService],
  controllers: [PagamentoController]
})
export class PagamentoModule {}
