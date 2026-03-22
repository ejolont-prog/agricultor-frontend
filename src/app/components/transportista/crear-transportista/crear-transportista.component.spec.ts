import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTransportistaComponent } from './crear-transportista.component';

describe('CrearTransportistaComponent', () => {
  let component: CrearTransportistaComponent;
  let fixture: ComponentFixture<CrearTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTransportistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
