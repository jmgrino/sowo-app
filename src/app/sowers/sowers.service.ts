import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../auth/user.model';
import { first, map, take, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Message } from './sower-chat/sower-chat.component';

import firebase from 'firebase/app';
import 'firebase/firestore';

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

  addMessage(message: Message) {
    return from(this.afs.collection('chats').add(message)).pipe(
      tap(  ref => {
        ref.update({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      })
    );
  }

  getMessages(senderId: string, receiverId: string) {
    const chatsCollection: AngularFirestoreCollection<Message> = this.afs.collection('chats', ref => ref.where('uid', '==', senderId).where('partnerId', '==', receiverId).orderBy("createdAt"));
    return chatsCollection.valueChanges().pipe(
      map(  messages => {
        messages.map( message => {

          return message;
        });
        return messages;
      })
    );    
  }

  deleteChats(senderId: string, receiverId: string) {
    this.afs.collection('chats', ref => ref.where('uid', '==', senderId).where('partnerId', '==', receiverId)).snapshotChanges().subscribe( snapshots => {
      snapshots.forEach(snapshot => {
        if(snapshot){
             this.afs.collection('chats').doc(snapshot.payload.doc.id).delete();
         }
     })
    });
    
  }

  // getMessages(senderId: string, receiverId: string) {
  //   console.log('get', senderId, receiverId);
    
  //   this.chatsCollection = this.afs.collection('chats', ref => ref.where('uid', '==', senderId).where('partnerId', '==', receiverId).orderBy("createdAt"));
  //   return this.chatsCollection.valueChanges().pipe(
  //     map(  messages => {
  //       messages.map( message => {

  //         return message;
  //       });
  //       return messages;
  //     })
  //   );    
  // }

}
