import { AfterContentInit, Component, LOCALE_ID, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, concatMap, map, of, take } from 'rxjs';
import { AccountService, EvaluationService, UserService } from '../../generated/services';
import EvaluationRecord from '../types/evaluation-record';
import { AsyncPipe, DatePipe, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl'
registerLocaleData(localePl);

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    AsyncPipe,
    DatePipe
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pl-PL" }
  ],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.scss'
})
export class EvaluationsComponent implements AfterContentInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private evaluationsSubject = new BehaviorSubject<EvaluationRecord[]>([]);

  public displayedColumns: string[] = ['id', 'userCode', 'balance', 'evaluationDate', 'isPassed'];

  public searchInput: string = '';

  public evaluationTableDataSource$ = new Observable<MatTableDataSource<EvaluationRecord>>();

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private userService: UserService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.evaluationService.getAllEvaluations().pipe(
      take(1),
      concatMap(evaluations => {
        let evaluationsWithUsers: Observable<any>[] = [];
        evaluations.forEach((evaluation) => {
          evaluationsWithUsers
            .push(this.userService
                .getUser({ id: evaluation.userId ?? '' })
                .pipe(map((user) => {
                  return { userCode: user.userCode, evaluationDate: evaluation.evaluationDate, id: evaluation.id, accountId: user.accountId, isPassed: evaluation.isPassed }
                })))
        })
        return combineLatest(evaluationsWithUsers);
      }),
      concatMap(evaluationsWithUsers => {
        let evaluationRecords$: Observable<EvaluationRecord>[] = [];
        evaluationsWithUsers.forEach(evaluationWithUsers => {
          evaluationRecords$
            .push(this.accountService
              .getAccount({id: evaluationWithUsers.accountId})
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
        return combineLatest(evaluationRecords$);
      })
    ).subscribe(result => {
      this.evaluationsSubject.next(result);
    });
  }

  ngAfterContentInit(): void {
    this.evaluationTableDataSource$ = this.evaluationsSubject.pipe(map((evaluationRecords) => {
      const source = new MatTableDataSource<EvaluationRecord>();
      source.data = evaluationRecords;
      source.paginator = this.paginator;
      return source;
    }))
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

  applyFilter(observable$: Observable<MatTableDataSource<EvaluationRecord>>) {
    this.evaluationTableDataSource$ = observable$.pipe(map((source) =>{
      source.data = this.filterData(source.data);
      return source;
    }));
  }
}
