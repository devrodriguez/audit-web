import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  CollectionReference, 
  DocumentData, 
  addDoc,
  query, 
  where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Audit } from '../interfaces/audit';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditColl: CollectionReference<DocumentData>;
  constructor(
    firestore: Firestore
  ) {
    this.auditColl = collection(firestore, 'audits');
  }

  getAudits() {
    return collectionData(this.auditColl, {
      idField: 'id'
    }) as Observable<Audit[]>;
  }

  getAuditsByAuditor(auditorID: string) {
    const q = query(this.auditColl, where('auditor.id', '==', auditorID))
    return collectionData(q, {
      idField: 'id'
    }) as Observable<Audit[]>
  }

  createAudit(audit: Audit) {
    return addDoc(this.auditColl, audit);
  }
}
