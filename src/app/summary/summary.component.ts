import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccountService, EvaluationService } from '../../generated/services';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, map, share, switchMap, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AsyncPipe } from '@angular/common';
import { EvaluationResponse } from '../../generated/models';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    MatCardModule,
    AsyncPipe
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  private evaluationsSubject = new BehaviorSubject<boolean>(false);
  private accountSubject = new BehaviorSubject<number>(0);
  private percentAdvantageSubject = new ReplaySubject<number>(0);

  private evaluations$: Observable<EvaluationResponse[]>

  public get passed() {
    return this.evaluationsSubject.asObservable();
  }

  public get balance() {
    return this.accountSubject.asObservable();
  }

  constructor(
    private evaluationService: EvaluationService,
    private accountService: AccountService) { }

  ngOnInit(): void {

    this.evaluations$ = this.evaluationService.getAllEvaluations().pipe(take(1), share());

    this.evaluations$.pipe(
      map(response => response.find(e => e.userId == sessionStorage.getItem('userId'))?.isPassed ?? false)
    ).subscribe(response => {
      this.evaluationsSubject.next(response);
    });

    this.accountService.getAccount({
      id: sessionStorage.getItem('accountId') ?? ""
    }).pipe(
      take(1),
      map(response => response.balance ?? 0)
    ).subscribe(response => {
      this.accountSubject.next(response);
    });

  }
}
