import { Component, OnInit } from '@angular/core';
import { ResetPasswordModel } from 'src/app/models/reset-password-model.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  type: string = "password";
  showPassword: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPasswordModel();

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private toast: NgToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    }, {
      validator: ConfirmPasswordValidator("newPassword", "confirmPassword")
    });
    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  hideShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPassword ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.showPassword ? this.type = "text" : this.type = "password";
  }

  ResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.newPassword;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetPasswordService.resetPassword(this.resetPasswordObj)
        .subscribe({
          next: (res) => {
            this.resetPasswordForm.reset();
            this.toast.success({ detail: "SUCCESS", summary: "Password reset successfully", duration: 2000 });
            this.router.navigate(['login']);
          },
          error: (err) => {
            this.toast.error({ detail: "ERROR", summary: err?.error?.message, duration: 5000 });
          }
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
