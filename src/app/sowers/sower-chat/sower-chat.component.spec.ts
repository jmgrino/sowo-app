import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SowerChatComponent } from './sower-chat.component';

describe('SowerChatComponent', () => {
  let component: SowerChatComponent;
  let fixture: ComponentFixture<SowerChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowerChatComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SowerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
