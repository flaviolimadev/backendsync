import { Test, TestingModule } from '@nestjs/testing';
import { SaqueService } from './saque.service';

describe('SaqueService', () => {
  let service: SaqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaqueService],
    }).compile();

    service = module.get<SaqueService>(SaqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
