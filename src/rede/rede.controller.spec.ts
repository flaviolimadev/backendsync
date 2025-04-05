import { Test, TestingModule } from '@nestjs/testing';
import { RedeController } from './rede.controller';

describe('RedeController', () => {
  let controller: RedeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedeController],
    }).compile();

    controller = module.get<RedeController>(RedeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
