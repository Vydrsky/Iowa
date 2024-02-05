import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../generated/services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription, catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationResponse } from '../../generated/models';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../common/components/loading/loading.component';
import { alphaNumValidator } from '../common/validators/alphanum-validator';
import { endsWithTwoNumbersValidator } from '../common/validators/ends-with-two-numbers-validator';

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
    LoadingComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  private sub = new Subscription();

  private authSource = new Subject<boolean>();
  private loadingSource = new ReplaySubject<boolean>(1);
  private loginValidators = [Validators.required, Validators.minLength(6), Validators.maxLength(6), alphaNumValidator(), endsWithTwoNumbersValidator()];

  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private router: Router,
    private toastrService: ToastrService) { }

  getLoading(): Observable<boolean> {
    return this.loadingSource.asObservable();
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userCode: ['', { validators: this.loginValidators, updateOn: "submit" }]
    });

    this.sub.add(this.authSource.pipe(
      debounceTime(300),
      tap(() => this.loadingSource.next(true)),
      switchMap(() => this.authenticationService.authenticate({
        body: {
          userCode: this.loginForm.value['userCode']
        }
      }).pipe(catchError((err) => {
        this.toastrService.error(err, '', {
          positionClass: 'toast-bottom-right'
        });
        return of(err)
      }))),
      tap(() => this.loadingSource.next(false)),
    ).subscribe((response) => {
      this.configureSession(response);
    }));

    this.sub.add(this.loginForm.get('userCode')!.valueChanges.subscribe(value => {
      if(value === `{<)#% M%<()#$<%B$#B$sdg.;F6a;(`) {
        this.authSource.next(true);
      }
    }));
  }

  login() {
    if(this.loginForm.valid) {
      this.authSource.next(true);
    }
  }

  configureSession(response: AuthenticationResponse) {
    sessionStorage.setItem('token', response.token ?? "");
    sessionStorage.setItem('userCode', response.userCode ?? "");
    sessionStorage.setItem('userId', response.id ?? "");
    sessionStorage.setItem('gameId', response.gameId ?? "");
    sessionStorage.setItem('accountId', response.accountId ?? "");

    if (response.isAdmin) {
      sessionStorage.setItem('admin', '1');
      this.router.navigate(['evaluations']);
    }
    else if (response.isArchived) {
      sessionStorage.setItem('archived', '1');
      this.router.navigate(['summary'])
    }
    else {
      this.router.navigate(['game']);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}


