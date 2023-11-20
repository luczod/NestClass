import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StateController } from '../state.controller';
import { StateEntity } from '../model/state.entity';
import { StateService } from '../state.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StateEntityMock } from '../__mocks__/state.mock';

describe('StateController', () => {
  let controller: StateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        StateService,
        {
          provide: getRepositoryToken(StateEntity),
          useValue: {
            find: vi.fn().mockResolvedValue(StateEntityMock),
            save: vi.fn().mockResolvedValue(StateEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
