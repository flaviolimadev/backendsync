import { Test, TestingModule } from '@nestjs/testing';
import { RedeService } from './rede.service';

describe('RedeService', () => {
  let service: RedeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedeService],
    }).compile();

    service = module.get<RedeService>(RedeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
