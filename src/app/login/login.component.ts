import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../generated/services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BehaviorSubject,debounce,interval,take, tap, } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthenticationResponse } from '../../generated/models';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private toastrService: ToastrService) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userCode: ['', {validators: [Validators.required, Validators.minLength(5)], updateOn: "blur"}]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.authenticationService.authenticate({
      body: {
        userCode: this.loginForm.value['userCode']
      }
    }).pipe(
      take(1),
      tap(response => {
        this.configureCookiesAndRoute(response);
      })).subscribe({
          next: response => {
            localStorage.setItem('userId', response.id!);
            localStorage.setItem('gameId', response.gameId!);
            localStorage.setItem('accountId', response.accountId!);
          },
          error: (err: string) => {
            console.log(err);
            this.toastrService.error(err, '', {
              positionClass: 'toast-bottom-right'
            });
          }
        });
  }

  configureCookiesAndRoute(response: AuthenticationResponse) {
    this.cookieService.set('token', response.token ?? "");
    this.cookieService.set('userCode', response.userCode ?? "");

    if (response.isAdmin){
      this.cookieService.set('admin', '1');
      this.router.navigate(['evaluations']);
    }
    else if(response.isArchived) {
      this.cookieService.set('archived', '1');
      this.router.navigate(['summary'])
    }
    else{
      this.router.navigate(['game']);
    }
  }
}


