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
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('nombre');
    const storedUserRole = localStorage.getItem('rol');

    if (storedUserId && storedUserName && storedUserRole) {
      this.loggedIn.next(true);
      this.userName.next(storedUserName);
      this.userRole.next(storedUserRole);
    }
  }

  logout(): void {
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.userName.next(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('empresaAsociada');
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