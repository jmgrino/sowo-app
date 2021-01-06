import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../auth/user.model';
import { first, map, take } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SowersService {
  sowerCollection: AngularFirestoreCollection<User>;
  sowerDoc: AngularFirestoreDocument<User>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
  ) { }

  fetchSowers() {
    this.sowerCollection = this.afs.collection('users');
    return this.sowerCollection.valueChanges().pipe(
      map(  users => {
        users.map( user => {
          user.photoUrl = 'https://i.picsum.photos/id/1027/2848/4272.jpg?hmac=EAR-f6uEqI1iZJjB6-NzoZTnmaX0oI0th3z8Y78UpKM';
          return user;
        });
        return users;
      })
    );
  }

  fetchOtherSowers(uid) {
    this.sowerCollection = this.afs.collection('users', ref => ref.where('uid', '!=', uid));
    return this.sowerCollection.valueChanges().pipe(
      map(  users => {
        users.map( user => {

          return user;
        });
        return users;
      })
    );
  }

  fetchSower(uid: string) {
    this.sowerDoc = this.afs.doc<User>(`users/${uid}`);
    return this.sowerDoc.valueChanges().pipe(
      map(  user => {

        return user;
      })
    );
  }

  saveSower(uid: string, changes: Partial<User>) {
    return from(this.afs.doc(`users/${uid}`).update(changes));
  }
}
