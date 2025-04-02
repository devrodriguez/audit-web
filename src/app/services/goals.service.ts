import { Injectable } from '@angular/core';
import { collection, collectionData, doc, CollectionReference, DocumentData, Firestore, addDoc, query, orderBy, where, collectionGroup, getDocs, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuditItem, AuditItemType } from '../interfaces/goal-item';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  public goalsCollRef: CollectionReference<DocumentData>
  public auditItemsCollRef: CollectionReference<DocumentData>
  private auditItemTypeRef: CollectionReference<DocumentData>
  private auditItemRef: CollectionReference<DocumentData>

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
    return collectionData(query(this.auditItemTypeRef), { idField: 'id'}) as Observable<AuditItemType[]>
  }

  async getAuditItem(id: string) {
    const items = query(collectionGroup(this.firestore, 'auditItemTypes'))
    const docRef = doc(this.firestore, 'auditItemTypes', id)
    const querySnap = await getDocs(items)

    return querySnap
  }

  getGoalItemsByType(typeName: string) {
    return collectionData(
      query(this.auditItemsCollRef,
        where('type.code', '==', typeName),
      ), {
      idField: 'id'
    }) as Observable<AuditItemType[]>
  }

  addGoalItem(auditItem: AuditItem) {
    return addDoc(this.auditItemsCollRef, auditItem)
  }
}
