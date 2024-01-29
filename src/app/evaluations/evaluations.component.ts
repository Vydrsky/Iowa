import { AfterContentInit, Component, LOCALE_ID, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, OperatorFunction, ReplaySubject, Subscription, combineLatest, debounceTime, forkJoin, map, switchMap, tap } from 'rxjs';
import { AccountService, EvaluationService, UserService } from '../../generated/services';
import EvaluationRecord from '../types/evaluation-record';
import { AsyncPipe, CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../common/dialogs/details/details.component';
import { LoadingComponent } from "../common/components/loading/loading.component";
registerLocaleData(localePl);

@Component({
  selector: 'app-evaluations',
  standalone: true,
  providers: [
    { provide: LOCALE_ID, useValue: "pl-PL" }
  ],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.scss',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    AsyncPipe,
    DatePipe,
    MatSortModule,
    LoadingComponent,
    CommonModule
  ]
})
export class EvaluationsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private evaluationsSource = new ReplaySubject<MatTableDataSource<EvaluationRecord, MatPaginator>>(1);
  private allData$: Observable<EvaluationRecord[]>;
  private loadingSource = new BehaviorSubject<boolean>(false);
  private sub = new Subscription();

  public evaluationsTableDataSource$: Observable<MatTableDataSource<EvaluationRecord, MatPaginator>>;
  public displayedColumns: string[] = ['id', 'userCode', 'balance', 'evaluationDate', 'isPassed'];
  public searchInput: string = '';

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private userService: UserService,
    private accountService: AccountService,
    private dialog: MatDialog) { }

  getEvaluationsSource(): Observable<MatTableDataSource<EvaluationRecord, MatPaginator>> {
    return this.evaluationsSource.asObservable();
  }

  getLoadingSource(): Observable<boolean> {
    return this.loadingSource.asObservable();
  }

  private getData(): OperatorFunction<any, EvaluationRecord[]> {
    return (source: Observable<any>) => source.pipe(
      switchMap(() => this.evaluationService.getAllEvaluations()),
      switchMap(evaluations => {
        let evaluationsWithUsers: Observable<any>[] = [];
        evaluations.forEach((evaluation) => {
          evaluationsWithUsers
            .push(this.userService
              .getUser({ id: evaluation.userId ?? '' })
              .pipe(map((user) => {
                return { userCode: user.userCode, evaluationDate: evaluation.evaluationDate, id: evaluation.id, accountId: user.accountId, isPassed: evaluation.isPassed }
              })))
        })
        return forkJoin(evaluationsWithUsers);
      }),
      switchMap(evaluationsWithUsers => {
        let evaluationRecords$: Observable<EvaluationRecord>[] = [];
        evaluationsWithUsers.forEach(evaluationWithUsers => {
          evaluationRecords$
            .push(this.accountService
              .getAccount({ id: evaluationWithUsers.accountId })
              .pipe(map(account => {
                return {
                  balance: account.balance ?? 0,
                  id: evaluationWithUsers.id,
                  userCode: evaluationWithUsers.userCode,
                  evaluationDate: evaluationWithUsers.evaluationDate,
                  isPassed: evaluationWithUsers.isPassed,
                }
              })));
        })
        return forkJoin(evaluationRecords$);
      })
    )
  }

  ngOnInit(): void {
    this.evaluationsTableDataSource$ = this.evaluationsSource.pipe(
      tap(() => this.loadingSource.next(true)),
      this.getData(),
      map((evaluationRecords) => {
        const source = new MatTableDataSource<EvaluationRecord>();
        source.data = evaluationRecords;
        source.paginator = this.paginator;
        source.sort = this.sort;
        return source;
      }),
      tap(() => this.loadingSource.next(false))
    );

    this.allData$ = this.evaluationsSource.pipe(debounceTime(300), this.getData());

    this.evaluationsSource.next(new MatTableDataSource());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
    localStorage.clear();
  }

  filterData(data: EvaluationRecord[]): EvaluationRecord[] {
    if (!this.searchInput) return data;
    return data.filter(el => el.userCode.toLowerCase().includes(this.searchInput));
  }

  applyFilter(source: MatTableDataSource<EvaluationRecord, MatPaginator>) {
    this.allData$.subscribe(data => {
      source.data = this.filterData(data);
    })
  }

  openDetails(record: EvaluationRecord) {
    this.dialog.open(DetailsComponent, {
      data: {
        id: record.id
      }
    });
  }
}
