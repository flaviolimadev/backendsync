import { Test, TestingModule } from '@nestjs/testing';
import { AutomacaoService } from './automacao.service';

describe('AutomacaoService', () => {
  let service: AutomacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomacaoService],
    }).compile();

    service = module.get<AutomacaoService>(AutomacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
