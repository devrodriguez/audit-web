import { Injectable } from '@angular/core';
import { 
  Auth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User, 
  browserSessionPersistence
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoginData } from '../interfaces/login-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>
  userData: User

  constructor(private readonly auth: Auth) { 
    onAuthStateChanged(auth, (user) => {
      this.userData = user
    })
  }

  register({ email, password }: LoginData) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  async signIn({ email, password }: LoginData) {
    return this.auth.setPersistence(browserSessionPersistence)
    .then(() => signInWithEmailAndPassword(this.auth, email, password))
    
  }

  signOut() {
    return signOut(this.auth)
  }
}
