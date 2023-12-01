import { Test, TestingModule } from '@nestjs/testing';
import { PaymentStatusService } from '../payment-status.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('PaymentStatusService', () => {
  let service: PaymentStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentStatusService],
    }).compile();

    service = module.get<PaymentStatusService>(PaymentStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
