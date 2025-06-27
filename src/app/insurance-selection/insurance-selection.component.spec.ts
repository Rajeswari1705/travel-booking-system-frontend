import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSelectionComponent } from './insurance-selection.component';

describe('InsuranceSelectionComponent', () => {
  let component: InsuranceSelectionComponent;
  let fixture: ComponentFixture<InsuranceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
