import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Enterprise } from '../interfaces/enterprise';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  private enterprisesColl: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.enterprisesColl = collection(firestore, 'enterprises');
  }

  getEnterprises() {
    return collectionData(this.enterprisesColl, {
      idField: 'id'
    }) as Observable<Enterprise[]>;
  }
}
