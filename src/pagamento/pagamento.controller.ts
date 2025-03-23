import { Body, Controller, Post } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Controller('pagamento')
export class PagamentoController {
    constructor(private readonly pagamentoService: PagamentoService) {}

    @Post()
    async gerarPagamento(@Body() body: CreatePagamentoDto) {
        return this.pagamentoService.generateQRCode(body.userId, body.valor, body.cpf, body.metodo);
    }
}
