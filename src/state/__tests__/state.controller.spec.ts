import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StateController } from '../state.controller';
import { StateEntity } from '../model/state.entity';
import { StateService } from '../state.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StateEntityMock } from '../__mocks__/state.mock';

describe('StateController', () => {
  let controller: StateController;
  let stateService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllState: vi.fn().mockResolvedValue([StateEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
    stateService = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(stateService).toBeDefined();
  });

  it('should return stateEntity in getAllState', async () => {
    const state = await controller.getAllState();

    expect(state).toEqual([StateEntityMock]);
  });
});
