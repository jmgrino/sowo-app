import { StorageService } from './../shared/storage.service';
import { UIService } from './../shared/ui.service';
import { BenefitsService } from './benefits.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { Benefit } from './benefit.model';
import { AuthService } from '../auth/auth.service';
import { AlertController } from '@ionic/angular';
import { concatMap, last } from 'rxjs/operators';

const IMAGENAME = 'brand-image';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.page.html',
  styleUrls: ['./benefits.page.scss'],
})
export class BenefitsPage implements OnInit {
  user: User;
  benefits$: Observable<Benefit[]>;
  editing = false;
  uploadPercent$: Observable<number>;
  defaultValue = '../../../assets/img/unknown_shop.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private benefitsService: BenefitsService,
    private uiService: UIService,
    private storageService: StorageService,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe( user => {
      this.user = user;
      this.benefits$ = this.benefitsService.fetchBenefits();
    });

  }

  onAdd() {
    this.router.navigateByUrl('/benefits/add');
  }

  onEdit() {
    this.editing = true;
  }

  onDone() {
    this.editing = false;
  }

  onEditItem(benefit) {
    this.router.navigateByUrl(`/benefits/edit/${benefit.id}`);
    
  }

  async onRemoveItem(benefit) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Confirmar',
      message: 'Borrar ' + benefit.company + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsAlertLeft',
        }, {
          text: 'Si',
          cssClass: 'buttonsAlertRight',
          handler: () => {
            this.benefitsService.deleteBenefit(benefit.id).subscribe( 
              () => {
                this.storageService.deleteFolderContents(`benefits/${benefit.id}`);
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

  onUploadPhoto(event, benefit) {
    const file: File = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = IMAGENAME + '.' + fileExt;
    const filePath = `benefits/${benefit.id}/${fileName}`;

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
         this.benefitsService.saveBenefit(benefit.id, {photoUrl: url}).subscribe( () => {},
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

}
