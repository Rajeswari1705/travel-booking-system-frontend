import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPackageReviewsComponent } from './agent-package-reviews.component';

describe('AgentPackageReviewsComponent', () => {
  let component: AgentPackageReviewsComponent;
  let fixture: ComponentFixture<AgentPackageReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPackageReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentPackageReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
