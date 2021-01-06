import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  user$: Observable<User>;
  hide = true;

  constructor(
    private auth: AuthService,
    private uiService: UIService,
    private fb: FormBuilder,
    private sidemenu: MenuController
    ) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[\x20-\x7E]{6,}$')]],
    });
    this.user$ = this.auth.getCurrentUser();

  }

  onLogin() {
    this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  onLogout() {
    this.auth.logout();
  }

  onMenuClick() {
    this.sidemenu.open();
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}
