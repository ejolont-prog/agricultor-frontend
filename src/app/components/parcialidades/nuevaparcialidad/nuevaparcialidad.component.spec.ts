import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaparcialidadComponent } from './nuevaparcialidad.component';

describe('NuevaparcialidadComponent', () => {
  let component: NuevaparcialidadComponent;
  let fixture: ComponentFixture<NuevaparcialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaparcialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaparcialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
