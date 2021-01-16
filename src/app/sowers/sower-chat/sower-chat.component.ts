import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Timestamp } from '@google-cloud/firestore';
import { IonContent } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UIService } from 'src/app/shared/ui.service';
import { SowersService } from '../sowers.service';

import firebase from 'firebase/app';
import 'firebase/firestore';
import { tap } from 'rxjs/operators';

export interface Message {
  id?: string;
  uid: string;
  createdAt?: Date;
  send: boolean;
  partnerId: string;
  msg: string;
  read: boolean;
}

@Component({
  selector: 'app-sower-chat',
  templateUrl: './sower-chat.component.html',
  styleUrls: ['./sower-chat.component.scss'],
})
export class SowerChatComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  @ViewChild('autofocus', { static: false }) msgInput;
  // @ViewChild('autofocus') msgInput;

 
  messages$: Observable<Message[]>;
  newMsg = '';
  sower: User;
  user: User;
  owner = false;

  constructor(
    private router: ActivatedRoute,
    private sowerService: SowersService,
    private authService: AuthService,
    private uiService: UIService,
  ) {}

  ngOnInit() {
    this.getData();
    
    // this.messages$ = of([
    //   {
    //     id: null,
    //     uid: '2mYFCZb0eUbhfyAK1ugFlvj4xdY2',
    //     createdAt: this.timestamp,
    //     send: true,
    //     partnerId: 'U9S0Itn5GVbxejlD1k6AHlZ4v1J2',
    //     msg: 'Bon dia!',
    //     read: true,
    //   },
    //   {
    //     id: null,
    //     uid: '2mYFCZb0eUbhfyAK1ugFlvj4xdY2',
    //     createdAt: this.timestamp,
    //     send: false,
    //     partnerId: 'U9S0Itn5GVbxejlD1k6AHlZ4v1J2',
    //     msg: 'Bon dia! Com va tot!',
    //     read: true,
    //   },
    //   {
    //     id: null,
    //     uid: '2mYFCZb0eUbhfyAK1ugFlvj4xdY2',
    //     createdAt: this.timestamp,
    //     send: true,
    //     partnerId: 'U9S0Itn5GVbxejlD1k6AHlZ4v1J2',
    //     msg: 'Molt bé!',
    //     read: true,
    //   },
    // ])

  }

  ionViewWillLeave() {
    this.sowerService.markReadMessages(this.user.uid, this.sower.uid);
  }


  getData() {
    const uid = this.router.snapshot.paramMap.get('id');
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.sowerService.fetchSower(uid).subscribe(sower => {
          this.sower = sower;
          if ( this.sower.uid === this.user.uid ) {
            this.owner = true;
          }
          this.messages$ = this.sowerService.getMessages(this.user.uid, this.sower.uid);
          this.msgInput.setFocus();
          
          this.messages$.subscribe( msgs => {
            this.msgInput.setFocus();
          },
          error => {
            const message = this.uiService.translateFirestoreError(error);
            this.uiService.showStdSnackbar(message);
          });
     
        });
      }
    });

  }

  sendMessage() {
    
    if ( this.newMsg.trim() ) {
      const message: Message = {
        uid: this.user.uid,
        send: true,
        partnerId: this.sower.uid,
        msg: this.newMsg.trim(),
        read: false,
      }

      this.sowerService.addMessage(message).subscribe( 
      (ref) => {
        this.newMsg = '';
        
      },
      error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      });

    }
  }
 
  displayTimestamp(timestamp: firebase.firestore.Timestamp) {
    const timestampOptions = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }

    if (timestamp) {
      return timestamp.toDate().toLocaleString('default', timestampOptions);
    } else {
      return '';
    } 
  }

  onClear() {
    this.sowerService.deleteChats(this.user.uid, this.sower.uid);

   
    // .subscribe( 
    //   () => {
    //     // Do nothing
    //   },
    //   error => {
    //     const message = this.uiService.translateFirestoreError(error);
    //     this.uiService.showStdSnackbar(message);
    //   });
  }

  scrollToBottton() {
    this.content.scrollToBottom();
  }

}
