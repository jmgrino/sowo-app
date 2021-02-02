import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Booking, CalEvent } from './event.model';
import { throwError, combineLatest, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import firebase from 'firebase/app';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  fetchEvents(uid) {
    const colEvents$ = this.afs.collection<CalEvent>('events').snapshotChanges().pipe(
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
    // const bookings$ = this.afs.collection<Booking>('bookings', ref => ref.where('userId', '==', uid)).valueChanges();
    const bookings$ = this.afs.collection<Booking>('bookings').valueChanges();
    return combineLatest([colEvents$, bookings$]).pipe(
      map( res => {
        const calEvents = res[0];
        const bookings = res[1];

        for (const calEvent of calEvents) {
          console.log(calEvent.name);
          console.log(calEvent);
          

          calEvent.booked = false;
          calEvent.attendants = 0;
          for (const booking of bookings) {
            console.log('-------- Booking ------------');
            
            console.log(booking);
            
            
            
            if (calEvent.id === booking.eventId) {
              calEvent.attendants++;
              console.log('Attendant++', calEvent.attendants);
              if (uid === booking.userId) {
                calEvent.booked = true; 
                console.log('Booked');
                
              }
            }
          }
        }

        return calEvents;
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

  addBooking(eventId, userId) {
    return this.afs.collection<Booking>('bookings', ref => ref.where('eventId', '==', eventId).where('userId', '==', userId)).get()
    .pipe(
      map( snaps => {
        return snaps.docs.map( snap => {
          return snap.data();
        });
      }),
      switchMap( res => {
        if (res.length == 0) {
          return from(this.afs.collection<Booking>('bookings').add({
              eventId,
              userId
            }));
        } else {
          return throwError(new Error('Ya existe una reserva con estos datos'));
        }
      })
    )
  }

  deleteBooking(eventId, userId) {
    return this.afs.collection<Booking>('bookings', ref => ref.where('eventId', '==', eventId).where('userId', '==', userId)).get().pipe(
      map( querySnapshot => {
        return querySnapshot.docs[0].ref.delete();
      })
    );
  }

}
