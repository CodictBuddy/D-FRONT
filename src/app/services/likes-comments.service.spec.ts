import { TestBed } from '@angular/core/testing';

import { LikesCommentsService } from './likes-comments.service';

describe('LikesCommentsService', () => {
  let service: LikesCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikesCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
