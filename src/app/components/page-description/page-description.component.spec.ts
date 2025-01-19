import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDescriptionComponent } from './page-description.component';

describe('PageDescriptionComponent', () => {
  let component: PageDescriptionComponent;
  let fixture: ComponentFixture<PageDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
