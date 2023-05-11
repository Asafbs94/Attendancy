import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required,]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  OnLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            alert(res.message)
          },
          error: (err) => {
            alert(err?.error.message)
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
