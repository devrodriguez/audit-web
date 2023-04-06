import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null)

  constructor(private readonly auth: Auth) {
    onAuthStateChanged(this.auth, (user: User) => {
      if(user) {
        this._user.next(user)
        this._loggedIn.next(true)
      } else {
        this._user.next(null)
        this._loggedIn.next(false)
      }
    })
  }

  get isLoggedIn() {
    return this._loggedIn.asObservable()
  }

  set loggedIn(status: boolean) {
    this._loggedIn.next(status)
  }

  get currentUser() {
    return this._user.asObservable()
  }

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
