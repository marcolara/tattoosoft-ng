import { TestBed, inject } from '@angular/core/testing';

import { AnonymousUserService } from './anonymous-user.service';

describe('AnonymousUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnonymousUserService]
    });
  });

  it('should be created', inject([AnonymousUserService], (service: AnonymousUserService) => {
    expect(service).toBeTruthy();
  }));
});
