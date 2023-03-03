import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, CollectionReference, DocumentData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Audit } from '../interfaces/audit';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditColl: CollectionReference<DocumentData>;
  constructor(
    private readonly firestore: Firestore
  ) {
    this.auditColl = collection(firestore, 'audits');
  }

  getAudits() {
    return collectionData(this.auditColl, {
      idField: 'id'
    }) as Observable<Audit[]>;
  }

  createAudit(audit: Audit) {
    return addDoc(this.auditColl, audit);
  }
}
