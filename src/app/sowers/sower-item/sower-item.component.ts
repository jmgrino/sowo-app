import {
  UIService
} from 'src/app/shared/ui.service';
import {
  AuthService
} from './../../auth/auth.service';
import {
  SowersService
} from './../sowers.service';
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  User
} from 'src/app/auth/user.model';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
import {
  SowerDialogComponent
} from '../sower-dialog/sower-dialog.component';
import {
  ShowdownConverter
} from 'ngx-showdown';

export interface DialogData {
  type: string;
  label: string;
  displayLabel: boolean;
  property: string;
  tag: string;
  canEdit: boolean;
  defaultValue: string;
  value?: any;
  uid?: string;
}

@Component({
  selector: 'app-sower-item',
  templateUrl: './sower-item.component.html',
  styleUrls: ['./sower-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SowerItemComponent implements OnInit {
  sower: User;
  user: User;
  owner = false;
  editing = false;
  http = 'http://';
  target = ' target="_blank"';
  socials = [];

  fields: DialogData[] = [
    {
      type: 'img',
      label: 'Foto URL',
      displayLabel: false,
      property: 'photoUrl',
      tag: null,
      canEdit: true,
      defaultValue: '../../../assets/img/unknown_person.png',
    },
    {
      type: 'text',
      label: 'Nombre',
      displayLabel: false,
      property: 'displayName',
      tag: 'h3',
      canEdit: true,
      defaultValue: '',
    },
    {
      type: 'text',
      label: 'Empresa',
      displayLabel: false,
      property: 'empresa',
      tag: 'p',
      canEdit: true,
      defaultValue: '',
    },
    {
      type: 'textarea',
      label: 'Linea descriptiva de negocio',
      displayLabel: true,
      property: 'descEmpresa',
      tag: null,
      canEdit: true,
      defaultValue: '',
    },
    {
      type: 'link',
      label: 'Web',
      displayLabel: false,
      property: 'web',
      tag: 'p',
      canEdit: true,
      defaultValue: '',
    },
    {
      type: 'icons',
      label: 'Redes sociales',
      displayLabel: false,
      property: 'socialLinks',
      tag: null,
      canEdit: true,
      defaultValue: '',
    },
    {
      type: 'textarea',
      label: '¿Que necesito?',
      displayLabel: true,
      property: 'queNecesito',
      tag: null,
      canEdit: true,
      defaultValue: '',
    },
    {
      type: 'textarea',
      label: '¿Que ofrezco?',
      displayLabel: true,
      property: 'queOfrezco',
      tag: null,
      canEdit: true,
      defaultValue: '',
    },
  ];

  allSocialLinks = [
    {
      name: 'instagram',
      icon: 'logo-instagram'
    },
    {
      name: 'linkedin',
      icon: 'logo-linkedin'
    },
  ];

  constructor(
    private router: ActivatedRoute,
    private sowerService: SowersService,
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UIService,
    private showdownConverter: ShowdownConverter,
  ) {}

  ngOnInit() {
    this.getSower();
  }

  // ngAfterViewInit() {
  //   this.getSower();
  // }

  getSower() {
    const uid = this.router.snapshot.paramMap.get('id');
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.sowerService.fetchSower(uid).subscribe(sower => {
          this.sower = sower;
          if ((this.sower.uid === this.user.uid) || (this.user.isAdmin === true)) {
            this.owner = true;
          }

          this.socials = [];

          for (const property in this.sower.socialLinks) {
            const url = this.sower.socialLinks[property];
            const icon = this.getIcon(url);
            this.socials.push({
              url,
              icon,
            });

          }
      
        });
      }
    });

  }

  onEditField(htmlData: DialogData) {

    const data = {
      value: this.sower[htmlData.property],
      uid: this.user.uid,
      ...htmlData
    };

    if (!data.value) {
      if (data.defaultValue) {
        data.value = data.defaultValue;
      }
    }

    if (data.type === 'icons') {
      if (data.value) {
        this.allSocialLinks.forEach( socialLink => {
          if (!data.value.hasOwnProperty(socialLink.name)) {
            data.value[socialLink.name] = '';
          }
          
        })
      } else {
        data.value = {};
        this.allSocialLinks.forEach( socialLink => {
          data.value[socialLink.name] = '';
        })

      }
      
    }


    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    // dialogConfig.closeOnNavigation = false;

    dialogConfig.data = data;

    if (data.type === 'textarea') {
      dialogConfig.width = '600px';
      dialogConfig.height = '400px';

    }

    this.dialog.open(SowerDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(newValue => {
        if (newValue !== null) {
          if (newValue !== data.value) {
            this.sowerService.saveSower(this.sower.uid, {
              [data.property]: newValue
            }).subscribe( () => {},
            error => {
              const message = this.uiService.translateFirestoreError(error);
              this.uiService.showStdSnackbar(message);
            });
          }
        }
      });

  }

  makeHtml(markdownText: string) {
  
    this.showdownConverter.setOptions({
      tables: true,
      strikethrough: true,
      noHeaderId: true,
      openLinksInNewWindow: true,
      underline: true,
    });
    return this.showdownConverter.makeHtml(markdownText);

  }

  getIcon(item) {

    for (const socialLink of this.allSocialLinks) {
      if ( item.toLowerCase().indexOf(socialLink.name) !== -1 ) {
        return socialLink.icon;
      }
    }

    return 'help-circle-outline';

  }

  onEdit() {
    this.editing = true;
  }


  onDone() {
    this.editing = false;
  }

}