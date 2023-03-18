import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPucLegComponent } from './edit-puc-leg.component';

describe('EditPucLegComponent', () => {
  let component: EditPucLegComponent;
  let fixture: ComponentFixture<EditPucLegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPucLegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPucLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
