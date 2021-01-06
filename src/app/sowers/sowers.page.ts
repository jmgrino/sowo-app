import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../auth/user.model';
import { SowersService } from './sowers.service';
import { tap } from 'rxjs/operators';
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
      this.getSowers();
    });
  }

  getSowers() {
      if (this.user) {
        this.sowers$ = this.sowersService.fetchOtherSowers(this.user.uid).pipe(
          tap(  results => results.sort())
        );
      }
  }

  // getSowers() {
  //   this.authService.getCurrentUser().subscribe( user => {
  //     if (user) {
  //       this.user = user;
  //       this.sowers$ = this.sowersService.fetchOtherSowers(user.uid).pipe(
  //         tap(  results => results.sort())
  //       );
  //     }
  //   });
  //   // this.sowers$ = this.sowersService.fetchSowers();
  // }

  onUserProfile() {
    this.router.navigate(['/sowers', this.user.uid]);
  }

}
