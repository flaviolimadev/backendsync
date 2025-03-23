import { Test, TestingModule } from '@nestjs/testing';
import { AutomacaoController } from './automacao.controller';

describe('AutomacaoController', () => {
  let controller: AutomacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomacaoController],
    }).compile();

    controller = module.get<AutomacaoController>(AutomacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
