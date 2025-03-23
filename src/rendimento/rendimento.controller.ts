import { Body, Controller, Post } from '@nestjs/common';
import { RendimentoService } from './rendimento.service';
import { CreateRendimentoDto } from './dto/create-rendimento.dto';

@Controller('rendimento')
export class RendimentoController {
  constructor(private readonly rendimentoService: RendimentoService) {}

  @Post()
  async aplicarRendimento(@Body() body: CreateRendimentoDto) {
    return this.rendimentoService.aplicarRendimento(body.operacao_id);
  }

  @Post('ciclo')
  aplicarRendimentoCiclo(@Body() dto: CreateRendimentoDto) {
    return this.rendimentoService.processarRendimentoTipo2(dto.operacao_id);
  }
}
