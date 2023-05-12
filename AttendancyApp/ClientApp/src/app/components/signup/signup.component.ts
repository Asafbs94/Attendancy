import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type: string = "password";
  showPassword: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm: FormGroup;


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      email: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      // password: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(8), // minimum length of 8 characters
      //   Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), // at least one uppercase, lowercase, digit, and special character
      // ])]
    })
  }


  hideShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPassword ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.showPassword ? this.type = "text" : this.type = "password";
  }

  OnSignUp() {
    if (this.signUpForm.valid) {
      this.auth.signUp(this.signUpForm.value)
        .subscribe({
          next: (res) => {
            // alert(res.message);
            this.signUpForm.reset();
            this.router.navigate(['dashboard'])
          },
          error: (err) => {
            alert(err?.error.message);
          }
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.signUpForm);
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
