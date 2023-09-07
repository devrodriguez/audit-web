import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditItemsComponent } from './edit-audit-items.component';

describe('EditPucLegComponent', () => {
  let component: EditAuditItemsComponent;
  let fixture: ComponentFixture<EditAuditItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAuditItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAuditItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
