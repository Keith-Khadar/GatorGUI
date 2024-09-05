import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KillStatusComponent } from './kill-status.component';

describe('KillStatusComponent', () => {
  let component: KillStatusComponent;
  let fixture: ComponentFixture<KillStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KillStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KillStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
