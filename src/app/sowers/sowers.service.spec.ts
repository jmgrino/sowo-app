import { TestBed } from '@angular/core/testing';

import { SowersService } from './sowers.service';

describe('SowersService', () => {
  let service: SowersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SowersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
