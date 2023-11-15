import { TestBed } from '@angular/core/testing';

import { DadataService } from './dadata.service';

describe('DadataService', () => {
  let service: DadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
