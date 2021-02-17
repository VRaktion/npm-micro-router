import { TestBed } from '@angular/core/testing';

import { MicroRouterService } from './micro-router.service';

describe('MicroRouterService', () => {
  let service: MicroRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
