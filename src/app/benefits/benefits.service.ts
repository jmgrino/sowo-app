import { Benefit } from './benefit.model';
// import { AuthService } from './../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BenefitsService {

  constructor(
    private afs: AngularFirestore,
    // private authService: AuthService
  ) { }

  fetchBenefits() {
    return this.afs.collection<Benefit>('benefits').snapshotChanges().pipe(
      map( snaps => {
        return snaps.map( snap => {
          return { id: snap.payload.doc.id, ...snap.payload.doc.data() }
        });
      }),
      switchMap( () => {
        return this.afs.collection<Benefit>('benefits').get()
        .pipe(
          map( snap => {
            return snap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() } as Benefit
            })
          })
        )
      })
    ); 
  }

  addBenefit(benefit: Benefit) {
    return from(this.afs.collection('benefits').add(benefit));
  }

  fetchBenefit(id: string) {
    return this.afs.doc<Benefit>(`benefits/${id}`).get().pipe(
      map( snap => {
          const id = snap.id;
          const data = snap.data();
          return { id, ...data } as Benefit;
      })
    )
  }

  saveBenefit(id: string, changes: Partial<Benefit>) {
    return from(this.afs.doc(`benefits/${id}`).update(changes));
  }
  
  deleteBenefit(id: string){
    return from(this.afs.doc(`benefits/${id}`).delete())
  }

}

