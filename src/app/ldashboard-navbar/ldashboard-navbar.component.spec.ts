import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdashboardNavbarComponent } from './ldashboard-navbar.component';

describe('LdashboardNavbarComponent', () => {
  let component: LdashboardNavbarComponent;
  let fixture: ComponentFixture<LdashboardNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdashboardNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdashboardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
