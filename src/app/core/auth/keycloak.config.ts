import Keycloak from 'keycloak-js';

export const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'itam',
  clientId: 'itam-frontend',
};

export const keycloak = new Keycloak(keycloakConfig);
