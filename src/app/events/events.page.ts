import { Component, OnInit } from '@angular/core';


import { interval, of } from 'rxjs';
import {delay, map, switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick() {

    console.log('Clicked');

    const firebase1$ = this.simulateFirebase("FB-1 ", 5000);
    const firebase2$ = this.simulateFirebase("FB-2 ", 1000);

    const firebaseResult$ = firebase1$.pipe(
      switchMap( sourceValue => {
        console.log("source value " + sourceValue);
        return this.simulateFirebase(sourceValue + " inner observable ", 1000).pipe(
          take(1)
        )
      })
    );
    
    firebaseResult$.subscribe(
      console.log,
      console.error,
      () => console.log('completed firebaseResult$')
    );

  }

  simulateFirebase(val: any, delay: number) {
    return interval(delay).pipe(
      map(index => val + " " + index)
    );
  }

}
