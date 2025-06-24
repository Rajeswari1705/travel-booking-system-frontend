import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCreatePackageComponent } from './agent-create-package.component';

describe('AgentCreatePackageComponent', () => {
  let component: AgentCreatePackageComponent;
  let fixture: ComponentFixture<AgentCreatePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCreatePackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCreatePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
