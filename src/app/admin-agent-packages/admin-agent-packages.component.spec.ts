import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgentPackagesComponent } from './admin-agent-packages.component';

describe('AdminAgentPackagesComponent', () => {
  let component: AdminAgentPackagesComponent;
  let fixture: ComponentFixture<AdminAgentPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAgentPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAgentPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
