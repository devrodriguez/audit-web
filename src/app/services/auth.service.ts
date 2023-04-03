import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly auth: Auth) { }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  signIn({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  signOut() {
    return signOut(this.auth)
  }
}
