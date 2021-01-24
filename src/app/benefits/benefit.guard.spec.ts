import { TestBed } from '@angular/core/testing';

import { BenefitGuard } from './benefit.guard';

describe('BenefitGuard', () => {
  let guard: BenefitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BenefitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
