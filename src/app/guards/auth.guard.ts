import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { Observable } from 'rxjs';

import { AppUser } from '../interfaces/app-user';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  appUser: AppUser = {} as AppUser
  pathIgnore: string[] = ['dashboard']

  constructor(
    private router: Router,
    private userSrv: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
    return new Promise((resolve, reject) => {
      const auth = getAuth()

      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userSrv.getUserByEmail(user.email)
            .then(appUser => {
              this.appUser = appUser
              const { roles } = route.data;

              if(roles && !roles.includes(appUser.role) && !this.pathIgnore.includes(route.routeConfig.path)) {
                this.router.navigateByUrl('dashboard', { replaceUrl: true })
              }
              resolve(true)
            })
        } else {
          this.router.navigateByUrl('login', { replaceUrl: true })
          resolve(false)
        }
      })
    })
  }

}
