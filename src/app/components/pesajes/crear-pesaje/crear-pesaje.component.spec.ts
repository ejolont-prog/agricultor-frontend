import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPesajeComponent } from './crear-pesaje.component';

describe('CrearPesajeComponent', () => {
  let component: CrearPesajeComponent;
  let fixture: ComponentFixture<CrearPesajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPesajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPesajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
