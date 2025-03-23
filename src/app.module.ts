import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagamentoModule } from './pagamento/pagamento.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SaqueModule } from './saque/saque.module';
import { AutomacaoModule } from './automacao/automacao.module';
import { OperacoesModule } from './operacoes/operacoes.module';
import { RendimentoModule } from './rendimento/rendimento.module';

@Module({
  imports: [
    PagamentoModule,
    ScheduleModule.forRoot(),
    SaqueModule,
    AutomacaoModule,
    OperacoesModule,
    RendimentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
