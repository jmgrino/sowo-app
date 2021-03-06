import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { from, interval, Observable, of } from 'rxjs';
import {concatMap, delay, last, map, switchMap, take} from "rxjs/operators";
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { StorageService } from '../shared/storage.service';
import { UIService } from '../shared/ui.service';
import { CalEvent } from './event.model';
import { EventsService } from './events.service';

import firebase from 'firebase/app';
import 'firebase/firestore';

const IMAGENAME = 'event-image';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  user: User;
  calEvents$: Observable<CalEvent[]>;
  editing = false;
  uploadPercent$: Observable<number>;
  defaultValue = '../../../assets/img/unknoun_event.png';
  // defaultValue = '../../../assets/img/unknown_shop.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventsService: EventsService,
    private uiService: UIService,
    private storageService: StorageService,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe( user => {
      this.user = user;
      this.calEvents$ = this.eventsService.fetchEvents(user.uid);



      // this.calEvents$ = of([
      //   {
      //     name: 'DESAYUNO',
      //     eventDate: new Date(2021,2,8),
      //     hours: 'De 8:30 a 9:30',
      //     prize: '15€ (12€ coworkers)',
      //     book: false,
      //     photoUrl: null,
      //   },
      //   {
      //     name: 'YOGA',
      //     eventDate: new Date(2021,2,8),
      //     hours: 'De 8:30 a 9:30',
      //     prize: 'Gratis',
      //     book: true,
      //     photoUrl: null,
      //   },
      // ]) 
    });
  }

  onAdd() {
    this.router.navigateByUrl('/events/add');
  }

  onEdit() {
    this.editing = true;
  }

  onDone() {
    this.editing = false;
  }

  onEditItem(calEvent) {
        this.router.navigateByUrl(`/events/edit/${calEvent.id}`);
  }

  onBookItem(calEvent) {
    // const message = 'Reservas todavia no implementadas';
    // this.uiService.showStdSnackbar(message);
    const userName = this.user.displayName ? this.user.displayName : this.user.email;
    this.eventsService.addBooking(calEvent.id, this.user.uid, userName)
    .subscribe( 
      () => {
        const message = "Reserva realizada";
        this.uiService.showStdSnackbar(message);
      },  error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      }
    )
    
  }

  onUnbookItem(calEvent) {
    this.eventsService.deleteBooking(calEvent.id, this.user.uid)
    .subscribe( 
      () => {
        const message = "Reserva anulada";
        this.uiService.showStdSnackbar(message);
      },  error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      }
    )
  }

  async onRemoveItem(calEvent) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Confirmar',
      message: 'Borrar ' + calEvent.name + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsAlertLeft',
        }, {
          text: 'Si',
          cssClass: 'buttonsAlertRight',
          handler: () => {
            this.eventsService.deleteEvent(calEvent.id).subscribe( 
              () => {
                this.storageService.deleteFolderContents(`events/${calEvent.id}`);
              },  error => {
                const message = this.uiService.translateFirestoreError(error);
                this.uiService.showStdSnackbar(message);
              }
            )

          }
        }
      ]
    });

    await alert.present();   
    
  }

  onAttendees(calEvent: CalEvent) {
    this.router.navigateByUrl(`/events/attendees/${calEvent.id}`);
  }

  onUploadPhoto(event, calEvent) {
    const file: File = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = IMAGENAME + '.' + fileExt;
    const filePath = `events/${calEvent.id}/${fileName}`;

    if (file.type.split('/')[0] !== 'image') {
      return alert('only image files');
    } else if (file.size >= (2 * 1024 * 1024) ) {
      this.uiService.showStdSnackbar('Imagen demasiado grande. Debe ser menor de 2 MBytes');
    } else {
      const task = this.storageService.uploadFile(filePath, file);
      this.uploadPercent$ = task.percentageChanges();

      task.snapshotChanges().pipe(
        last(),
        concatMap( () => this.storageService.getDownloadURL(filePath) )
      ).subscribe(  url => {
         this.eventsService.saveEvent(calEvent.id, {photoUrl: url}).subscribe( () => {},
         error => {
          const message = this.uiService.translateStorageError(error);
          this.uiService.showStdSnackbar(message);
        });
      }, error => {
        const message = this.uiService.translateStorageError(error);
        this.uiService.showStdSnackbar(message);
      });
    }
  }

  // displayDate(date: Date) {
  //   const dateOptions = {
  //     weekday: 'long',
  //     day: '2-digit',
  //     month: 'long',
  //     // month: '2-digit',
  //     year: 'numeric',
  //     // year: '2-digit',
  //     // hour: '2-digit',
  //     // minute: '2-digit',
  //     // second: '2-digit',
  //   }

  //   if (date) {
  //     return date.toLocaleString('es-ES', dateOptions);
  //   } else {
  //     return '';
  //   } 
  // }

  displayTimestamp(timestamp: firebase.firestore.Timestamp) {
    const timestampOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      // month: '2-digit',
      year: 'numeric',
      // year: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
    }

    if (timestamp) {
      return timestamp.toDate().toLocaleString('es-ES', timestampOptions);
    } else {
      return '';
    } 
  }

}
