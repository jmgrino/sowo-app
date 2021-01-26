import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Sowers',
      url: '/sowers',
      icon: 'people-outline',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Beneficios',
      url: '/benefits',
      icon: 'ribbon-outline',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Eventos',
      url: '/events',
      icon: 'calendar-outline',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
    {
      title: 'Login',
      url: '/auth/login',
      icon: 'enter-outline',
      onlyAuth: false,
      onlyAdmin: false,
      hideOnAuth: true
    },
    {
      title: 'Registrar',
      url: '/auth/signup',
      icon: 'person-add-outline',
      onlyAuth: true,
      onlyAdmin: true,
      hideOnAuth: false
    },
    {
      title: 'Logout',
      url: '/auth/login',
      icon: 'log-out-outline',
      onlyAuth: true,
      onlyAdmin: false,
      hideOnAuth: false
    },
  ];

  public appFilteredPages = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authService.initAuthListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.getCurrentUser().subscribe(  user => {
        if (user) {
          if (user.isAdmin === true) {
            this.appFilteredPages = this.appPages.filter( menuItem => menuItem.hideOnAuth === false);
          } else {
            this.appFilteredPages = this.appPages.filter( menuItem => ( menuItem.hideOnAuth === false && menuItem.onlyAdmin === false ));
          }
        } else {
          this.appFilteredPages = this.appPages.filter( menuItem => menuItem.onlyAuth === false);
        }
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }
}
