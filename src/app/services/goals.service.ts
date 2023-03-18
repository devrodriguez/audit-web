import { Injectable } from '@angular/core';
import { collection, collectionData, doc, CollectionReference, DocumentData, Firestore, addDoc, query, orderBy, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Goal } from '../interfaces/goal';
import { GoalItem } from '../interfaces/goal-item';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  public goalsCollRef: CollectionReference<DocumentData>;
  public goalItemsCollRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.goalItemsCollRef = collection(this.firestore, 'goalItems')
  }

  getGoalItems() {
    return collectionData(query(this.goalItemsCollRef, orderBy('code', 'asc')), {
      idField: 'id'
    }) as Observable<GoalItem[]>
  }

  getGoalItemsByType(typeName: string) {
    return collectionData(
      query(this.goalItemsCollRef,
        where('type.name', '==', typeName),
        orderBy('code', 'asc')
      ), {
      idField: 'id'
    }) as Observable<GoalItem[]>
  }

  addGoalItem(goalItem: GoalItem) {
    return addDoc(this.goalItemsCollRef, goalItem)
  }
}
