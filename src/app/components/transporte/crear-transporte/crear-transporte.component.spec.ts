import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTransporteComponent } from './crear-transporte.component';

describe('CrearTransporteComponent', () => {
  let component: CrearTransporteComponent;
  let fixture: ComponentFixture<CrearTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTransporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
