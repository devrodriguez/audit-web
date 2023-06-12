import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public formLogin: FormGroup

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly authSrv: AuthService,
    private readonly router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [])
    })
  }

  onSubmit() {
    if(this.formLogin.valid) {
      this.authSrv.signIn(this.formLogin.value)
      .then(res => {
        this.router.navigate(['/audit'], { replaceUrl: true })
      })
      .catch(err => {
        this.presentSnackBar('Email or password incorrect')
        console.error(err)
      })
    }
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
