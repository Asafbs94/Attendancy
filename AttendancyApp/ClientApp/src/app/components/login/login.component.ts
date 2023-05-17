import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  showPassword: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  loginForm: FormGroup;
  public resetPasswordEmail: string;
  public isValidEmail: boolean;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  hideShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPassword ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.showPassword ? this.type = "text" : this.type = "password";
  }

  OnLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginForm.reset();
            this.auth.storeToken(res.token);
            const tokenPayload = this.auth.decodeToken();
            this.userStore.setFullNameFromStore(tokenPayload.unique_name);
            this.userStore.setEmailFromStore(tokenPayload.email);
            this.userStore.setUserNameFromStore(tokenPayload.given_name);
            this.userStore.setRoleFromStore(tokenPayload.role);
            this.toast.success({ detail: "SUCCESS", summary: res.message, duration: 2000 });
            this.router.navigate(['dashboard']);
            return true;
          },
          error: (err) => {
            this.toast.error({ detail: "ERROR", summary: err?.error.message, duration: 5000 });
            return false;
          }
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {

      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.toast.success({
              detail: "SUCCESS",
              summary: "Reset password success",
              duration: 2000
            });
            this.resetPasswordEmail = "";
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error: (err) => {
            this.toast.error({
              detail: "ERROR",
              summary: err.error.message,
              duration: 5000
            });
          }
        });
    }
  }

  dontSend() {
    this.resetPasswordEmail = "";
  }
}
