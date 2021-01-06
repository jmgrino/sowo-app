import { TestBed } from '@angular/core/testing';

import { SowerGuard } from './sower.guard';

describe('SowerGuard', () => {
  let guard: SowerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SowerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
