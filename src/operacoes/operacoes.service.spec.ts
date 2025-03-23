import { Test, TestingModule } from '@nestjs/testing';
import { OperacoesService } from './operacoes.service';

describe('OperacoesService', () => {
  let service: OperacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperacoesService],
    }).compile();

    service = module.get<OperacoesService>(OperacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
