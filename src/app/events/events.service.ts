import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { calEvent } from './event.model';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  fetchEvents() {
    return this.afs.collection<calEvent>('events').snapshotChanges().pipe(
      map( snaps => {
        return snaps.map( snap => {
          return { id: snap.payload.doc.id, ...snap.payload.doc.data() }
        });
      }),
      switchMap( () => {
        return this.afs.collection<calEvent>('events').get()
        .pipe(
          map( snap => {
            return snap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() } as calEvent
            })
          })
        )
      })
    );    
  }

  addEvent(calEvent: calEvent) {
    return from(this.afs.collection('events').add(calEvent));
  }

}
