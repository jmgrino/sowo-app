import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../auth/user.model';
import { filter, map, take } from 'rxjs/operators';
import { combineLatest, from } from 'rxjs';
import { Message } from './sower-chat/sower-chat.component';

import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SowersService {
  // sowerCollection: AngularFirestoreCollection<User>;
  // messageCollection: AngularFirestoreCollection<Message>;
  sowerDoc: AngularFirestoreDocument<User>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
  ) { }


  fetchOtherSowers(uid) {
    
    const sowers$ = this.afs.collection<User>('users', ref => ref.where('uid', '!=', uid)).valueChanges();
    const messages$ = this.afs.collection<Message>('chats', ref => ref.where('uid', '==', uid).where('read', '==', false).where('send', '==', false)).valueChanges();

    return combineLatest([
      sowers$,
      messages$
    ]).pipe(
      map( res => {
        const sowers = res[0];
        const messages = res[1];

        for (var sower of sowers) {
          sower.unreadMsgs = 0;
        }

        if (messages.length > 0) {
          messages.sort((a, b) => a.uid.localeCompare(b.uid));
          let totals = [];
          let lastUid = messages[0].partnerId;
          let count = 0;
          for (var message of messages) {
            if (message.partnerId === lastUid) {
              count++;
            } else {
              totals.push({
                uid: lastUid,
                count
              });
              count = 1;
              lastUid = message.partnerId;
            }
          }
          totals.push({
            uid: lastUid,
            count
          });
          
          for (var total of totals) {
            var foundIndex = sowers.findIndex(sower => sower.uid == total.uid);
            if (foundIndex >= 0) {
              sowers[foundIndex].unreadMsgs = total.count;
            }
          }
        }

        return sowers;
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
    const dupMessage = {
      uid: message.partnerId,
      send: !message.send,
      partnerId: message.uid,
      msg: message.msg,
      read: message.read,
    }
    const ref = this.afs.collection('chats').add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...message
    }).then( ref => {
      const ref2 = this.afs.collection('chats').add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...dupMessage
      }).then( ref => {
        // Done
      });
    });

    return from(ref);
  }

  getMessages(senderId: string, receiverId: string) {

    this.markReadMessages(senderId, receiverId);

    const chatsCollection: AngularFirestoreCollection<Message> = this.afs.collection('chats', ref => ref.where('uid', '==', senderId).where('partnerId', '==', receiverId).orderBy("createdAt"));
    return chatsCollection.valueChanges().pipe(
      filter(  messages => {
        let skip = false;
        messages.forEach( message => {
          if (!message.createdAt) {
            skip = true;
          }
        })        
        return !skip;
      })
    );    
  }



  markReadMessages(senderId: string, receiverId: string) {
    this.afs.collection<Message>('chats', ref => ref.where('uid', '==', senderId).where('partnerId', '==', receiverId).where('read', '==', false)).get()
    .subscribe( result => {
      const messages = result.docs;
      for (var message of messages) {
        this.afs.collection<Message>('chats').doc(message.id).update({read: true});
      }
    });
  }

  deleteChats(senderId: string, receiverId: string) {
    this.afs.collection('chats', ref => ref.where('uid', '==', senderId).where('partnerId', '==', receiverId)).snapshotChanges().pipe(
      take(1)
    ).subscribe( snapshots => {
      snapshots.forEach(snapshot => {
        if(snapshot){
             this.afs.collection('chats').doc(snapshot.payload.doc.id).delete();
         }
     })
    });
    
  }

}
