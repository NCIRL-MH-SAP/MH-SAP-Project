import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public form: FormGroup;
  errorMessage?: string;
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.formBuilder.group({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  submitForm() {
    if (this.form.invalid) {
      return;
    }

    var email = this.form.get('email')?.value;
    var password = this.form.get('password')?.value;

    this.authService.login(email, password).subscribe(
      (res: any) => {
        console.log(res)
        if (this.authService.isLoggedInAdmin()) {
          this.router.navigate(['/admin']);
          return;
        }

        if (this.authService.getLoggedInUserId()) {
          this.router.navigate(['/employee']);
          return;
        }

        this.router.navigate(['/home']);

      },
      error => {
        this.errorMessage = error?.error?.message ?? "Invalid user credentials";
      })
  }
}