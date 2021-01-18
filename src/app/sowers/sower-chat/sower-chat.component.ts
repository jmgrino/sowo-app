import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UIService } from 'src/app/shared/ui.service';
import { SowersService } from '../sowers.service';
import { AlertController } from '@ionic/angular';

import firebase from 'firebase/app';
import 'firebase/firestore';

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
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    this.getData();

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
      // second: '2-digit',
    }

    if (timestamp) {
      return timestamp.toDate().toLocaleString('es-ES', timestampOptions);
    } else {
      return '';
    } 
  }

  async onClear() {

    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Confirmar',
      message: 'Borrar todos los mensajes de este chat?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsAlertLeft',
        }, {
          text: 'Si',
          cssClass: 'buttonsAlertRight',
          handler: () => {
            this.sowerService.deleteChats(this.user.uid, this.sower.uid);
          }
        }
      ]
    });

    await alert.present();    

  }

  scrollToBottton() {
    this.content.scrollToBottom();
  }

}
