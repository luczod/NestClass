import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StateService } from '../state.service';
import { Repository } from 'typeorm';
import { StateEntity } from '../model/state.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StateEntityMock } from '../__mocks__/state.mock';

describe('StateService', () => {
  let service: StateService;
  let stateRepository: Repository<StateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<StateService>(StateService);
    stateRepository = module.get<Repository<StateEntity>>(getRepositoryToken(StateEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(stateRepository).toBeDefined();
  });

  it('should return list of states in getAllState', async () => {
    const state = await service.getAllState();

    expect(state).toEqual(StateEntityMock);
  });

  it('should return error in getAllState', async () => {
    vi.spyOn(stateRepository, 'find').mockRejectedValueOnce(new Error());

    expect(service.getAllState()).rejects.toThrow();
  });
});
