import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { keycloak } from './keycloak.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  return from(keycloak.updateToken(30)).pipe(
    switchMap(() => {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${keycloak.token}` },
      });
      return next(cloned);
    }),
  );
};
