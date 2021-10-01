import { TestBed } from '@angular/core/testing';

import { AuditreportService } from './auditreport.service';

describe('AuditreportService', () => {
  let service: AuditreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
