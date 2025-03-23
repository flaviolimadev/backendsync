import { Test, TestingModule } from '@nestjs/testing';
import { RendimentoService } from './rendimento.service';

describe('RendimentoService', () => {
  let service: RendimentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RendimentoService],
    }).compile();

    service = module.get<RendimentoService>(RendimentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
