import { TestBed } from '@angular/core/testing';

import { GeojsonApiService } from './geojson-api.service';

describe('GeojsonApiService', () => {
  let service: GeojsonApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeojsonApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
