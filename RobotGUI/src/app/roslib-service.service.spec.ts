import { TestBed } from '@angular/core/testing';

import { RoslibServiceService } from './roslib-service.service';

describe('RoslibServiceService', () => {
  let service: RoslibServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoslibServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
