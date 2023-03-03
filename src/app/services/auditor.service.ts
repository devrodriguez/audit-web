import { Injectable } from '@angular/core';
import { addDoc, collectionData, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Auditor } from '../interfaces/auditor';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

  private auditorColl: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.auditorColl = collection(firestore, 'auditors');
  }

  getAuditors() {
    return collectionData(this.auditorColl, {
      idField: 'id'
    }) as Observable<Auditor[]>;
  }

  createAuditor(auditor: Auditor) {
    return addDoc(this.auditorColl, auditor);
  }
}
