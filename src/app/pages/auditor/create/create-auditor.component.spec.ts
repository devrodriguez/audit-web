import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuditorComponent } from './create-auditor.component';

describe('AuditorComponent', () => {
  let component: AuditorComponent;
  let fixture: ComponentFixture<AuditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
