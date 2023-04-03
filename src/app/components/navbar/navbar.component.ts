import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private readonly authSrv: AuthService,
    private readonly router: Router) { }

  ngOnInit(): void {
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
