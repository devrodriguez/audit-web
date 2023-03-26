import { Injectable } from '@angular/core';
import { 
  Firestore,
  collection, 
  collectionData, 
  CollectionReference, 
  DocumentData, 
  addDoc,
  query, 
  where, 
  updateDoc,
  doc} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, UploadResult } from '@angular/fire/storage'
import { Observable } from 'rxjs';
import { Audit } from '../interfaces/audit';
import { GoalFile } from '../interfaces/goal-file';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditColl: CollectionReference<DocumentData>;
  constructor(
    private firestore: Firestore,
    private fireStorage: Storage
  ) {
    this.auditColl = collection(firestore, 'audits');
  }

  getAudits() {
    return collectionData(this.auditColl, {
      idField: 'id'
    }) as Observable<Audit[]>;
  }

  getAuditsByAuditor(auditorID: string) {
    const q = query(this.auditColl, where('goalItems', 'array-contains', { auditor: { id: auditorID } }))
    return collectionData(q, {
      idField: 'id'
    }) as Observable<Audit[]>
  }

  createAudit(audit: Audit) {
    return addDoc(this.auditColl, audit);
  }

  updateAudit(audit: Audit) {
    return updateDoc(doc(this.firestore, "audits", audit.id), { ...audit })
  }
}
