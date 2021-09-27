import { TestBed } from '@angular/core/testing';

import { AuditmasterService } from './auditmaster.service';

describe('AuditmasterService', () => {
  let service: AuditmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
