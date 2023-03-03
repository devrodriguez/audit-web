import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Goal } from '../interfaces/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  public goalsCollRef: CollectionReference<DocumentData>;
  constructor(private readonly firestore: Firestore) {
    this.goalsCollRef = collection(this.firestore, 'goals')
  }

  getGoals() {
    return collectionData(this.goalsCollRef, {
      idField: 'id'
    }) as Observable<Goal[]>
  }
}
