import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly authSrv: AuthService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    })
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await this.authSrv.signIn(this.loginForm.value)
        this.loginForm.reset()
        this.router.navigateByUrl('dashboard', { replaceUrl: true })
      } catch (err) {
        this.presentSnackBar('Email or password incorrect')
        console.error(err)
      }
    }
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
