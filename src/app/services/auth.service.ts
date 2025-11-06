import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string | null>(null);
  private userName = new BehaviorSubject<string | null>(null);

  constructor(private router: Router) {
    // Check if user is logged in from localStorage on app start
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (storedLoggedIn === 'true' && storedUserRole && storedUserName) {
      this.loggedIn.next(true);
      this.userRole.next(storedUserRole);
      this.userName.next(storedUserName);
    }
  }

  login(username: string, password: string): boolean {
    // Simple authentication for demonstration
    if (username === 'Ingeniero' && password === '1234') {
      this.loggedIn.next(true);
      this.userRole.next('empleado');
      this.userName.next('Ingeniero');
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userRole', 'empleado');
      localStorage.setItem('userName', 'Ingeniero');
      return true;
    } else if (username === 'Cliente' && password === '1234') {
      this.loggedIn.next(true);
      this.userRole.next('cliente');
      this.userName.next('Cliente');
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userRole', 'cliente');
      localStorage.setItem('userName', 'Cliente');
      return true;
    }
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.userName.next(null);
    return false;
  }

  logout(): void {
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.userName.next(null);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  getUserName(): Observable<string | null> {
    return this.userName.asObservable();
  }

  getRoleSnapshot(): string | null {
    return this.userRole.getValue();
  }

  getNameSnapshot(): string | null {
    return this.userName.getValue();
  }
}