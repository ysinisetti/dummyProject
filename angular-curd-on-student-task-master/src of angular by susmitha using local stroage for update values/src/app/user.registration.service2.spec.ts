import { TestBed } from '@angular/core/testing';

import { UserRegistationService2 } from './user.registration.service2';

describe('UserRegistationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRegistationService2 = TestBed.get(UserRegistationService2);
    expect(service).toBeTruthy();
  });
});