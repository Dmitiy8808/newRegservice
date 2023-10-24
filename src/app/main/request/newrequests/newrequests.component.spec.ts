import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewrequestsComponent } from './newrequests.component';

describe('NewrequestsComponent', () => {
  let component: NewrequestsComponent;
  let fixture: ComponentFixture<NewrequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewrequestsComponent]
    });
    fixture = TestBed.createComponent(NewrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
