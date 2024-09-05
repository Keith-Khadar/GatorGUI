import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrustersComponent } from './thrusters.component';

describe('ThrustersComponent', () => {
  let component: ThrustersComponent;
  let fixture: ComponentFixture<ThrustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThrustersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThrustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
