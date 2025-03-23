import { Test, TestingModule } from '@nestjs/testing';
import { SaqueController } from './saque.controller';

describe('SaqueController', () => {
  let controller: SaqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaqueController],
    }).compile();

    controller = module.get<SaqueController>(SaqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
