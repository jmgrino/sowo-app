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
import { AngularFireStorage } from '@angular/fire/storage';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private benefitsService: BenefitsService,
    private uiService: UIService,
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
                this.deleteFolderContents(`benefits/${benefit.id}`);
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
      const task = this.storage.upload(filePath, file);
      this.uploadPercent$ = task.percentageChanges();

      task.snapshotChanges().pipe(
        last(),
        concatMap( () => this.storage.ref(filePath).getDownloadURL() )
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

  private deleteFolderContents(path) {
    const ref = this.storage.ref(path);
  
    ref.listAll()
      .subscribe(
        dir => {
          console.log('Dir', dir.items);
          
          dir.items.forEach(fileRef => {
            console.log(fileRef);
            
            this.deleteFile(path, fileRef.name);
          });
          // dir.prefixes.forEach(folderRef => {
          //   this.deleteFolderContents(folderRef.fullPath);
          // })
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private deleteFile(pathToFile, fileName) {
    const ref = this.storage.ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete();
  }

}
