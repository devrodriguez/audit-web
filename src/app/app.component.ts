import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public authSrv: AuthService) {
    console.log('on app component: ', this.authSrv.userData)
  }

  ngOnInit(): void {
    console.log('on app component init: ', this.authSrv.userData)
  }
}
