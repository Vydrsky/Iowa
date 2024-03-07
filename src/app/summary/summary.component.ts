import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccountService, EvaluationService } from '../../generated/services';
import { ReplaySubject, Subscription, map, share, switchMap, take } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { EvaluationSummaryRangeResponse } from '../../generated/models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    AsyncPipe
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  private sub = new Subscription();
  private evaluationsSubject = new ReplaySubject<boolean>(1);
  private accountSubject = new ReplaySubject<number>(1);
  private percentAdvantageSubject = new ReplaySubject<any>(1);
  private summaryRangeSubject = new ReplaySubject<MatTableDataSource<EvaluationSummaryRangeResponse>>(1);

  public get passed() {
    return this.evaluationsSubject.asObservable();
  }

  public get balance() {
    return this.accountSubject.asObservable();
  }

  public get advantage() {
    return this.percentAdvantageSubject.asObservable();
  }

  public get range() {
    return this.summaryRangeSubject.asObservable();
  }

  public displayedColumns: string[] = ['name', 'accountBalance'];

  constructor(
    private evaluationService: EvaluationService,
    private accountService: AccountService) { }

  ngOnInit(): void {

    this.sub.add(this.evaluationService.getAllEvaluations().pipe(
      map(response => response.find(e => e.userId == sessionStorage.getItem('userId'))?.isPassed ?? false)
    ).subscribe(response => {
      this.evaluationsSubject.next(response);
    }));

    this.sub.add(this.accountService.getAccount({
      id: sessionStorage.getItem('accountId') ?? ""
    }).pipe(
      map(response => response.balance ?? 0)
    ).subscribe(response => {
      this.accountSubject.next(response);
    }));

    this.sub.add(this.evaluationService.getAllEvaluations().pipe(
      map(response => response.find(e => e.userId == sessionStorage.getItem('userId'))),
      switchMap(evaluation => this.evaluationService.getEvaluationPercentAdvantage({
        id: evaluation?.id ?? ""
      }))
    ).subscribe(response => {
      this.percentAdvantageSubject.next(response.advantage);
    }))

    this.sub.add(this.evaluationService.getAllEvaluations().pipe(
      map(response => response.find(e => e.userId == sessionStorage.getItem('userId'))),
      switchMap(evaluation => this.evaluationService.getEvaluationSummaryRange({
        id: evaluation?.id ?? ""
      })),
      map(range => {
        const source = new MatTableDataSource<EvaluationSummaryRangeResponse>();
        source.data = range ?? [];
        return source;
      }),
    ).subscribe(response => {
      this.summaryRangeSubject.next(response);
    }))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
