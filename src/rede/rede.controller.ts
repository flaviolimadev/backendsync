import { Controller, Post, Body } from '@nestjs/common';
import { RedeService } from './rede.service';
import { RedeDto } from './dto/rede.dto';

@Controller('rede')
export class RedeController {
  constructor(private readonly redeService: RedeService) {}

  @Post()
  async getRede(@Body() body: RedeDto) {
    return this.redeService.montarRedeComTotais(body.profile_id);
  }
}
