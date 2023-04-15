import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User>;
  isLoggedIn: boolean = false

  constructor(
    private readonly authSrv: AuthService,
    private readonly router: Router) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    
  }

  logOut() {
    this.authSrv.signOut()
    .then(res => {
      this.router.navigate(['/login'], { replaceUrl: true })
    })
    .catch(err => {
      console.error(err)
    })
  }

}
