import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authSrv: AuthService
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
      return new Promise((resolve, reject) => {
        const auth = getAuth()

        onAuthStateChanged(auth, (user) => {
          if(user) {
            resolve(true)
          } else {
            this.router.navigateByUrl('login', { replaceUrl: true })
          resolve(false)
          }
        })
      })
  }
  
}
