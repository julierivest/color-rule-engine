import { TestBed } from '@angular/core/testing';

import { StudentsTableStoreService } from './students-table-store.service';

describe('StudentsTableStoreService', () => {
  let service: StudentsTableStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsTableStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
