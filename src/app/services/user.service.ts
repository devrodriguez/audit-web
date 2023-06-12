import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, DocumentData, getDocs, query, where, collection } from '@angular/fire/firestore';

import { AppUser } from '../interfaces/app-user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userColRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.userColRef = collection(this.firestore, 'users');
   }

  async getUserByEmail(email: string): Promise<AppUser> {
    const qr = query(this.userColRef, where('email', '==', email))
    const querySnapshot = await getDocs(qr)

    return new Promise((resolve, reject) => {
      const user = querySnapshot.docs[0].data() as AppUser;
      resolve(user)
    })
  }
}
