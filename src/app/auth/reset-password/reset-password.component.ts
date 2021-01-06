import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  email: string;
  PasswordResetForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    ) { }

  ngOnInit() {
    this.PasswordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onChangePassword() {
    return this.auth.resetPassword(this.PasswordResetForm.value.email)
    .then(() => this.router.navigate(['/auth/login']));
  }

}
