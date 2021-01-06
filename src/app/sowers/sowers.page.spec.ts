import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SowersPage } from './sowers.page';

describe('SowersPage', () => {
  let component: SowersPage;
  let fixture: ComponentFixture<SowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
