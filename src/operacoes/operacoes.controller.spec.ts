import { Test, TestingModule } from '@nestjs/testing';
import { OperacoesController } from './operacoes.controller';

describe('OperacoesController', () => {
  let controller: OperacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperacoesController],
    }).compile();

    controller = module.get<OperacoesController>(OperacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
