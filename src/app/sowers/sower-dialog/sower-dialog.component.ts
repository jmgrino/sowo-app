import { UIService } from 'src/app/shared/ui.service';
import { DialogData } from './../sower-item/sower-item.component';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { concatMap, last } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sower-dialog',
  templateUrl: './sower-dialog.component.html',
  styleUrls: ['./sower-dialog.component.scss'],
})
export class SowerDialogComponent implements OnInit {
  dialogForm: FormGroup;
  labelText: string;
  data: DialogData;
  imageURL: string;
  uploadPercent$: Observable<number>;
  downloadURL: Observable<string>;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['key', 'link']


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SowerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    private storage: AngularFireStorage,
    private uiService: UIService
  ) {
    this.data = data;
    if (data.type === 'img') {
      this.imageURL = data.value;
    }

    if (data.type === 'icons') {
      this.dialogForm = this.fb.group({
        socials: this.fb.array([]),
        loadImage: [null]
      });
      for (const property in data.value as object) {
        this.addSocial(property, data.value[property]);
      }
      this.dataSource = new MatTableDataSource((this.dialogForm.get('socials') as FormArray).controls);
      
    } else {
      this.dialogForm = this.fb.group({
        editText: [data.value, [Validators.required]],
        loadImage: [null]
      });

    }

    // this.form.get('editText').setValidators([Validators.required, Validators.email, Validators.maxLength(20)]);

  }

  ngOnInit() {}

  get socials() : FormArray {
    return this.dialogForm.get('socials') as FormArray;
  }

  addSocial(key: string, link: string) {
    this.socials.push(this.fb.group({
      key,
      link
    }));
 }

  uploadPostImage(event) {
    const file: File = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = 'avatar.' + fileExt;
    const filePath = `users/${this.data.uid}/${fileName}`;
    // const filePath = `users/${this.data.uid}/${file.name}`;
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
        this.imageURL = url;
      }, error => {
        const message = this.uiService.translateStorageError(error);
        this.uiService.showStdSnackbar(message);
      });

    }
  }

  onSubmit() {
    if ( this.data.type === 'img' ) {
      this.dialogRef.close(this.imageURL);
    } else if ( this.data.type === 'link' ) {
      this.dialogRef.close(this.dialogForm.value.editText.replace(/(^\w+:|^)\/\//, ''));
    } else if ( this.data.type === 'icons' ) {
      var socials = this.dialogForm.value.socials;
      var result = {};

      // if (obj.hasOwnProperty(prop)) {
      // }
      for (var i = 0; i < socials.length; i++) {
        if (socials[i].link) {
          result[socials[i].key] = socials[i].link;
        }
      }
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close(this.dialogForm.value.editText);
    }
  }

  close() {
    this.dialogRef.close(null);
  }

}
