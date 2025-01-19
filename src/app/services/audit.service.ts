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
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Audit } from '../interfaces/audit';
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
    const q = query(this.auditColl, orderBy('createdAt', 'desc'))

    return collectionData(q, {
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

  upsertAudit(audit: Audit) {
    return updateDoc(doc(this.firestore, "audits", audit.id), { ...audit })
  }
doc
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
    const now = new Date().toISOString()

    if (itemReport.id) {
      return updateDoc(
        doc(this.firestore, "itemReports", itemReport.id),
        {
          itemContent: itemReport.itemContent,
          updatedAt: now
        }
      )
    }

    itemReport.createdAt = now
    return this.saveItemReport(itemReport)
  }
}
