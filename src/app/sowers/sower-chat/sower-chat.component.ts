import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UIService } from 'src/app/shared/ui.service';
import { SowersService } from '../sowers.service';

export interface Message {
  // createdAt: firebase.firestore.FieldValue;
  createdAt: Date;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Component({
  selector: 'app-sower-chat',
  templateUrl: './sower-chat.component.html',
  styleUrls: ['./sower-chat.component.scss'],
})
export class SowerChatComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
 
  messages: Observable<any[]>;
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
    this.getSower();
    // this.messages = this.chatService.getChatMessages();
    this.messages = of([
      {
        // createdAt: firebase.firestore.FieldValue;
        createdAt: new Date(),
        id: '123456',
        from: "user1111",
        msg: 'Bon dia!',
        fromName: 'Josep Maria',
        myMsg: true
      },
      {
        // createdAt: firebase.firestore.FieldValue;
        createdAt: new Date(),
        id: '123456',
        from: "user1111",
        msg: 'Bon dia! Com va tot!',
        fromName: 'Laura',
        myMsg: false
      },
      {
        // createdAt: firebase.firestore.FieldValue;
        createdAt: new Date(),
        id: '123456',
        from: "user1111",
        msg: 'Molt bé!',
        fromName: 'Josep Maria',
        myMsg: true
      },
    ])
  }

  getSower() {
    const uid = this.router.snapshot.paramMap.get('id');
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.sowerService.fetchSower(uid).subscribe(sower => {
          this.sower = sower;
          if ( this.sower.uid === this.user.uid ) {
            this.owner = true;
          }
     
        });
      }
    });

  }

  sendMessage() {
    // this.chatService.addChatMessage(this.newMsg).then(() => {
    //   this.newMsg = '';
    //   this.content.scrollToBottom();
    // });
  }
 
  signOut() {
    // this.chatService.signOut().then(() => {
    //   this.router.navigateByUrl('/', { replaceUrl: true });
    // });
  }
 


}
