import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeEmpleadoPage } from './home-empleado.page';

describe('HomeEmpleadoPage', () => {
  let component: HomeEmpleadoPage;
  let fixture: ComponentFixture<HomeEmpleadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
