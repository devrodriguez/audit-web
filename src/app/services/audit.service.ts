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
  doc,
  getDocs
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, UploadResult } from '@angular/fire/storage'
import { Observable } from 'rxjs';
import { Audit } from '../interfaces/audit';
import { GoalFile } from '../interfaces/goal-file';
import { GoalItem } from '../interfaces/goal-item';
import { ItemReport } from '../interfaces/item-report';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditColl: CollectionReference<DocumentData>;
  private itemRepoColl: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore
  ) {
    this.auditColl = collection(firestore, 'audits');
    this.itemRepoColl = collection(firestore, 'itemReports');
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

  saveItemReport(itemReport: ItemReport) {
    return addDoc(this.itemRepoColl, itemReport)
  }

  getItemReport(auditID: string, goalItemID: string) {
    return collectionData(
      query(
        this.itemRepoColl,
        where('auditID', '==', auditID),
        where('goalItemID', '==', goalItemID)
      ), {
        idField: 'id'
      }) as Observable<ItemReport[]>
  }

  getAuditItemsReport(auditID: string) {
    return collectionData(
      query(
        this.itemRepoColl,
        where('auditID', '==', auditID)
      ), {
        idField: 'id'
      }
    ) as Observable<ItemReport[]>
  }

  updateItemReport(itemReport: ItemReport) {   
    if(itemReport.id) {
      return updateDoc(doc(this.firestore, "itemReports", itemReport.id), { itemContent: itemReport.itemContent })
    }
    return this.saveItemReport(itemReport)
  }
}
