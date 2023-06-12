import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/interfaces/app-user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>
  currentUser$: Observable<User>
  isLoggedIn: boolean = false
  appUser: AppUser = {} as AppUser

  routes: any[] = []
  baseRoutes: any[] = [
    {
      routerLink: '/audit',
      description: 'Audit',
      forRoles: ['ADMIN']
    },
    {
      routerLink: '/audits',
      description: 'Audits',
      forRoles: ['ADMIN']
    },
    {
      routerLink: '/auditor',
      description: 'Auditor',
      forRoles: ['ADMIN']
    },
    {
      routerLink: '/auditor-experience',
      description: 'Auditor Experience',
      forRoles: ['ADMIN', 'AUDITOR']
    },
    {
      routerLink: '/audit-items',
      description: 'Audit Items',
      forRoles: ['ADMIN']
    }
  ]

  constructor(
    private readonly authSrv: AuthService,
    private readonly userSrv: UserService,
    private readonly router: Router) {
      this.load()
    }

  ngOnInit() {}

  ngOnDestroy(): void {}

  async load() {
    await this.loadUser()
    this.checkPermisions(this.appUser.role)
  }

  async loadUser() {
    try {
      this.appUser = await this.userSrv.getUserByEmail(this.authSrv.userData.email)
    } catch (err) {
      console.error(err)
    }
  }

  logOut() {
    this.authSrv.signOut()
    .then(res => {
      this.isLoggedIn = false
      this.router.navigate(['/login'], { replaceUrl: true })
    })
    .catch(err => {
      console.error(err)
    })
  }

  checkPermisions(userRole: string) {
    this.routes = this.baseRoutes.filter(rt => {
      return rt.forRoles.includes(userRole)
    })
  }

}
