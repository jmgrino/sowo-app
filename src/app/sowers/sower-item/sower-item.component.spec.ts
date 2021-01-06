import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SowerItemComponent } from './sower-item.component';

describe('SowerItemComponent', () => {
  let component: SowerItemComponent;
  let fixture: ComponentFixture<SowerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowerItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SowerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
