import { EventEditComponent } from './event-edit/event-edit.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { CalEvent } from './event.model';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import firebase from 'firebase/app';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  fetchEvents() {
    return this.afs.collection<CalEvent>('events').snapshotChanges().pipe(
      map( snaps => {
        return snaps.map( snap => {
          return { id: snap.payload.doc.id, ...snap.payload.doc.data() }
        });
      }),
      switchMap( () => {
        return this.afs.collection<CalEvent>('events', ref => ref.orderBy('eventDate')).get()
        .pipe(
          map( snap => {
            return snap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() } as CalEvent
            })
          })
        )
      })
    );    
  }

  fetchEvent(id: string) {
    return this.afs.doc<CalEvent>(`events/${id}`).get().pipe(
      map( snap => {
          const id = snap.id;
          const data = snap.data();
          const timestamp: firebase.firestore.Timestamp = data.eventDate;
          data.eventDate = timestamp.toDate();
          return { id, ...data } as CalEvent;
      })
    )
  }
  
  addEvent(calEvent: CalEvent) {
    return from(this.afs.collection('events').add(calEvent));
  }

  saveEvent(id: string, changes: Partial<CalEvent>) {
    return from(this.afs.doc(`events/${id}`).update(changes));
  }

  deleteEvent(id: string){
    return from(this.afs.doc(`events/${id}`).delete())
  }


}
