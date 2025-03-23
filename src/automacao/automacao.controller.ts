import { Controller, Post, Body } from '@nestjs/common';
import { AutomacaoService } from './automacao.service';
import { CreateAutomacaoDto } from './dto/create-automacao.dto';

@Controller('automacao')
export class AutomacaoController {
  constructor(private readonly automacaoService: AutomacaoService) {}

  @Post()
  async criar(@Body() dto: CreateAutomacaoDto) {
    return this.automacaoService.criarAutomacao(dto);
  }
}
