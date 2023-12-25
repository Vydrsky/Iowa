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

  private login$ = new BehaviorSubject<AuthenticationResponse>({});

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
        this.cookieService.set('token', response.token ?? "");
        this.cookieService.set('userCode', response.userCode ?? "");
        this.router.navigateByUrl('game');
      })).subscribe({
          next: response => this.login$.next(response),
          error: (err: string) => {
            console.log(err);
            this.toastrService.error(err, '', {
              positionClass: 'toast-bottom-right'
            });
          }
        });
  }
}


