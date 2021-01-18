import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../auth/user.model';
import { SowersService } from './sowers.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sowers',
  templateUrl: './sowers.page.html',
  styleUrls: ['./sowers.page.scss'],
})
export class SowersPage implements OnInit {
  sowers$: Observable<User[]>;
  user: User;
  defaultValue = '../../../assets/img/unknown_person.png';

  constructor(
    private sowersService: SowersService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe( user => {
      this.user = user;
      this.sowers$ = this.getOtherSowers();
    });
  }

  getOtherSowers() {

      if (this.user) {
        return this.sowersService.fetchOtherSowers(this.user.uid).pipe(
          map(  results => {
            results.sort(( a, b ) => {

              const x = a.displayName ? a.displayName : a.email
              const y = b.displayName ? b.displayName : b.email

              if (a.unreadMsgs > 0) {
                if (b.unreadMsgs > 0) {
                  return x.localeCompare(y);
                } else {
                  return -1;
                }
              } else {
                if (b.unreadMsgs > 0) {
                  return 1;
                } else {
                  return x.localeCompare(y);;
                }                
              }
            })

            return results;
          })
        );
      }
  }

  onUserProfile() {
    this.router.navigate(['/sowers', this.user.uid]);
  }

}
