import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://localhost:5001/api/Account';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  // Signal for current user
  private currentUserSignal = signal<User | null>(null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  // BehaviorSubject for reactive state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Computed signal for authentication status
  public readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Load user data from localStorage on service initialization
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.setUser(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * Set user data in both signal and BehaviorSubject
   */
  private setUser(user: User): void {
    this.currentUserSignal.set(user);
    this.currentUserSubject.next(user);
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.currentUserSignal.set(null);
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, credentials).pipe(
      tap({
        next: (user) => {
          this.setUser(user);
        },
        error: (error) => {
          console.error('Login error:', error);
        }
      })
    );
  }

  /**
   * Register new user
   */
  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, registerData).pipe(
      tap({
        next: (user) => {
          this.setUser(user);
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
