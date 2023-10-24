import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompliteComponent } from './complite.component';

describe('CompliteComponent', () => {
  let component: CompliteComponent;
  let fixture: ComponentFixture<CompliteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompliteComponent]
    });
    fixture = TestBed.createComponent(CompliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
