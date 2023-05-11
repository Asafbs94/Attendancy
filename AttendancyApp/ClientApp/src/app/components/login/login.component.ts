import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8), // minimum length of 8 characters
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), // at least one uppercase, lowercase, digit, and special character
      ])]
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
            // alert(res.message);
            this.loginForm.reset();
            this.router.navigate(['dashboard'])
            return true;
          },
          error: (err) => {
            alert(err?.error.message);
            return false;
          }
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }

  // private validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //       control.markAsDirty({ onlySelf: true });
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFormFields(control);
  //     }

  //   })
  // }
}
