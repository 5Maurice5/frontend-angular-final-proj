import { keycloak } from './keycloak.config';

export function initializeKeycloak(): () => Promise<boolean> {
  return () =>
    keycloak.init({
      onLoad: 'login-required', // fuerza login antes de ver cualquier página
      pkceMethod: 'S256', // PKCE, como pide el sílabo
      checkLoginIframe: false, // evita problemas de iframes bloqueados en dev
    });
}
