import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { getAuth, onAuthStateChanged } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      /*
      const auth = getAuth()

      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.router.navigateByUrl('dashboard', { replaceUrl: true })
          resolve(false)
        } else {
          resolve(true)
        }
      })
      */
      resolve(true)
    })
  }

}
