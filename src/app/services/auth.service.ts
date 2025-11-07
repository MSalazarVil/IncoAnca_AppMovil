import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userId = new BehaviorSubject<string | null>(null);
  private userRole = new BehaviorSubject<string | null>(null);
  private userName = new BehaviorSubject<string | null>(null);
  private userEmail = new BehaviorSubject<string | null>(null);
  private userCargo = new BehaviorSubject<string | null>(null);
  private userTelefono = new BehaviorSubject<string | null>(null);
  private userUsuario = new BehaviorSubject<string | null>(null);
  private userEmpresaAsociada = new BehaviorSubject<string | null>(null);

  constructor(private router: Router) {
    // Check if user is logged in from localStorage on app start
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('nombre');
    const storedUserRole = localStorage.getItem('rol');
    const storedUserEmail = localStorage.getItem('email');
    const storedUserCargo = localStorage.getItem('cargo');
    const storedUserTelefono = localStorage.getItem('telefono');
    const storedUserUsuario = localStorage.getItem('usuario');
    const storedUserEmpresaAsociada = localStorage.getItem('empresaAsociada');

    if (storedUserId && storedUserName && storedUserRole) {
      this.loggedIn.next(true);
      this.userId.next(storedUserId);
      this.userName.next(storedUserName);
      this.userRole.next(storedUserRole);
      this.userEmail.next(storedUserEmail);
      this.userCargo.next(storedUserCargo);
      this.userTelefono.next(storedUserTelefono);
      this.userUsuario.next(storedUserUsuario);
      this.userEmpresaAsociada.next(storedUserEmpresaAsociada);
    }
  }

  loginSuccess(userId: string, nombre: string, rol: string, empresaAsociada: string, email: string, cargo: string, telefono: string, usuario: string): void {
    this.loggedIn.next(true);
    this.userId.next(userId);
    this.userName.next(nombre);
    this.userRole.next(rol);
    this.userEmail.next(email);
    this.userCargo.next(cargo);
    this.userTelefono.next(telefono);
    this.userUsuario.next(usuario);
    this.userEmpresaAsociada.next(empresaAsociada);

    localStorage.setItem('userId', userId);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('rol', rol);
    localStorage.setItem('empresaAsociada', empresaAsociada);
    localStorage.setItem('email', email);
    localStorage.setItem('cargo', cargo);
    localStorage.setItem('telefono', telefono);
    localStorage.setItem('usuario', usuario);
  }

  logout(): void {
    this.loggedIn.next(false);
    this.userId.next(null);
    this.userRole.next(null);
    this.userName.next(null);
    this.userEmail.next(null);
    this.userCargo.next(null);
    this.userTelefono.next(null);
    this.userUsuario.next(null);
    this.userEmpresaAsociada.next(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('empresaAsociada');
    localStorage.removeItem('email');
    localStorage.removeItem('cargo');
    localStorage.removeItem('telefono');
    localStorage.removeItem('usuario');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserId(): Observable<string | null> {
    return this.userId.asObservable();
  }

  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  getUserName(): Observable<string | null> {
    return this.userName.asObservable();
  }

  getUserEmail(): Observable<string | null> {
    return this.userEmail.asObservable();
  }

  getUserCargo(): Observable<string | null> {
    return this.userCargo.asObservable();
  }

  getUserTelefono(): Observable<string | null> {
    return this.userTelefono.asObservable();
  }

  getUserUsuario(): Observable<string | null> {
    return this.userUsuario.asObservable();
  }

  getUserEmpresaAsociada(): Observable<string | null> {
    return this.userEmpresaAsociada.asObservable();
  }

  getUserIdSnapshot(): string | null {
    return this.userId.getValue();
  }

  getRoleSnapshot(): string | null {
    return this.userRole.getValue();
  }

  getNameSnapshot(): string | null {
    return this.userName.getValue();
  }

  getEmailSnapshot(): string | null {
    return this.userEmail.getValue();
  }

  getCargoSnapshot(): string | null {
    return this.userCargo.getValue();
  }

  getTelefonoSnapshot(): string | null {
    return this.userTelefono.getValue();
  }

  getUsuarioSnapshot(): string | null {
    return this.userUsuario.getValue();
  }

  getUserEmpresaAsociadaSnapshot(): string | null {
    return this.userEmpresaAsociada.getValue();
  }

  refreshUserData(updatedData: any): void {
    if (updatedData.nombre) {
      this.userName.next(updatedData.nombre);
      localStorage.setItem('nombre', updatedData.nombre);
    }
    if (updatedData.rol) {
      this.userRole.next(updatedData.rol);
      localStorage.setItem('rol', updatedData.rol);
    }
    if (updatedData.email) {
      this.userEmail.next(updatedData.email);
      localStorage.setItem('email', updatedData.email);
    }
    if (updatedData.cargo) {
      this.userCargo.next(updatedData.cargo);
      localStorage.setItem('cargo', updatedData.cargo);
    }
    if (updatedData.telefono) {
      this.userTelefono.next(updatedData.telefono);
      localStorage.setItem('telefono', updatedData.telefono);
    }
    if (updatedData.usuario) {
      this.userUsuario.next(updatedData.usuario);
      localStorage.setItem('usuario', updatedData.usuario);
    }
    if (updatedData.empresaAsociada !== undefined) {
      this.userEmpresaAsociada.next(updatedData.empresaAsociada);
      localStorage.setItem('empresaAsociada', updatedData.empresaAsociada);
    }
  }
}