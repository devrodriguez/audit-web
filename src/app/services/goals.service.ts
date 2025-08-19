import { Injectable } from '@angular/core';
import { collection, collectionData, doc, CollectionReference, DocumentData, Firestore, addDoc, query, orderBy, where, collectionGroup, getDocs, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuditItem } from '../interfaces/audit-item';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  public goalsCollRef: CollectionReference<DocumentData>
  public auditItemsCollRef: CollectionReference<DocumentData>
  private auditItemTypeRef: CollectionReference<DocumentData>

  constructor(private readonly firestore: Firestore) {
    this.auditItemsCollRef = collection(this.firestore, 'auditItems')
    this.auditItemTypeRef = collection(this.firestore, 'auditItemTypes')
  }

  getAuditItems() {
    return collectionData(query(this.auditItemsCollRef, orderBy('name', 'asc')), {
      idField: 'id'
    }) as Observable<AuditItem[]>
  }

  getAuditItemTypes() {
    return collectionData(query(this.auditItemTypeRef), { idField: 'id'}) as Observable<AuditItem[]>
  }

  async getAuditItem() {
    const items = query(collectionGroup(this.firestore, 'auditItemTypes'))
    const querySnap = await getDocs(items)

    return querySnap
  }

  getAuditItemsByType(typeName: string) {
    return collectionData(
      query(this.auditItemsCollRef,
        where('type.code', '==', typeName),
      ), {
      idField: 'id'
    }) as Observable<AuditItem[]>
  }

  addGoalItem(auditItem: AuditItem) {
    return addDoc(this.auditItemsCollRef, auditItem)
  }
}
