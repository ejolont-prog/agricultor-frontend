import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcialidadesComponent } from './parcialidades.component';

describe('ParcialidadesComponent', () => {
  let component: ParcialidadesComponent;
  let fixture: ComponentFixture<ParcialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcialidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
