import { Injectable, computed, signal } from '@angular/core';
import { keycloak } from './keycloak.config';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private rolesSignal = signal<string[]>(keycloak.tokenParsed?.realm_access?.roles ?? []);
  private usernameSignal = signal<string>(keycloak.tokenParsed?.['preferred_username'] ?? '');

  roles = computed(() => this.rolesSignal());
  username = computed(() => this.usernameSignal());

  hasRole(role: string): boolean {
    return this.rolesSignal().includes(role);
  }

  isAdmin = computed(() => this.hasRole('ROLE_ADMIN'));

  logout() {
    keycloak.logout({ redirectUri: window.location.origin });
  }
}
