import { Injectable } from '@angular/core';
import { 
  Router, 
  ActivatedRoute, 
  CanActivate, 
  RouterStateSnapshot, 
  ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ) {
    return this.authService.getAuth().flatMap(auth => {
      if (!auth)
        return Observable.create(observer=> observer.next(null));
      
      return this.authService.isAdminUser(auth.uid);
    }).take(1)
      .map((res: any) => res && res.$value !== null)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      });
  }
}
