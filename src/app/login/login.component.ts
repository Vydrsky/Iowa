import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../generated/services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, catchError, filter, ignoreElements, of, take, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthenticationResponse, ProblemDetails } from '../../generated/models';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  private login$ = new BehaviorSubject<AuthenticationResponse>({});

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private cookieService: CookieService,
    private router: Router) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userCode: ['', [Validators.required, Validators.minLength(1)]]
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
        this.cookieService.set('token', response.token ?? "");
        this.router.navigateByUrl('game');
      })).subscribe(response => {
          this.login$.next(response);
        });
  }
}


