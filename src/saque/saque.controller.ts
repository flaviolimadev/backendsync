import { Controller, Post, Body } from '@nestjs/common';
import { SaqueService } from './saque.service';
import { CreateSaqueDto } from './dto/create-saque.dto';

@Controller('saques')
export class SaqueController {
  constructor(private readonly saqueService: SaqueService) {}

  @Post()
  async solicitarSaque(@Body() dto: CreateSaqueDto) {
    return this.saqueService.solicitarSaque(dto);
  }
}
