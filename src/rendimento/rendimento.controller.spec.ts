import { Test, TestingModule } from '@nestjs/testing';
import { RendimentoController } from './rendimento.controller';

describe('RendimentoController', () => {
  let controller: RendimentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RendimentoController],
    }).compile();

    controller = module.get<RendimentoController>(RendimentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
