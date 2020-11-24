import { TestBed } from '@angular/core/testing';

import { ComunicaService } from './comunica.service';

describe('ComunicaService', () => {
  let service: ComunicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
