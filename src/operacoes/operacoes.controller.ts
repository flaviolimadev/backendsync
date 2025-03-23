import { Controller, Post } from '@nestjs/common';
import { OperacoesService } from './operacoes.service';

@Controller('operacoes')
export class OperacoesController {
  constructor(private readonly operacoesService: OperacoesService) {}

  @Post('sincronizar')
  async sincronizar() {
    return this.operacoesService.sincronizarOperacoes();
  }
}
