import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AccountService, GameService, UserService } from '../../generated/services';
import { AccountResponse, CardRequest, GameResponse, RoundResponse } from '../../generated/models';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, combineLatest, debounce, debounceTime, delay, distinct, distinctUntilChanged, forkJoin, map, mergeMap, of, pipe, share, shareReplay, skip, switchMap, take, tap, throttle, throttleTime, throwError, withLatestFrom, zip, } from 'rxjs';
import { NormalizeNumberPipe } from '../common/pipes/normalize-number.pipe';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RulesComponent } from '../common/dialogs/rules/rules.component';
import { CardTypePipe } from "../common/pipes/card-type.pipe";
import { CustomPaginator } from '../config/custom-paginator';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    CardComponent,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatExpansionModule,
    MatPaginatorModule,
    NormalizeNumberPipe,
    MatDialogModule,
    CardTypePipe,
  ],
  providers: [
    {provide: MatPaginatorIntl, useValue: CustomPaginator()}
  ]
})
export class GameComponent implements AfterContentInit, OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private refreshSubject = new ReplaySubject<boolean>(1);
  private addRoundSubject = new ReplaySubject<CardRequest>(1);
  private changeSubject = new ReplaySubject<CardRequest>(1);
  private overlaySubject = new BehaviorSubject<boolean>(false);
  private gameId: string;
  private accountId: string;
  public getAccountShare$: Observable<AccountResponse>;
  public getGameShare$: Observable<GameResponse>;
  private sub = new Subscription();
  private refreshGame$: Observable<GameResponse>;
  private refreshAccount$: Observable<AccountResponse>;

  public getAccount$: Observable<AccountResponse>;
  public getGame$: Observable<GameResponse>;
  public roundTableDataSource$ = new Observable<MatTableDataSource<RoundResponse>>();

  public displayedColumns: string[] = ['roundNumber', 'previousBalance', 'total', 'change', 'type'];

  constructor(
    private router: Router,
    private gameService: GameService,
    private accountService: AccountService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.gameId = sessionStorage.getItem('gameId') ?? '';
    this.accountId = sessionStorage.getItem('accountId') ?? '';

    this.refreshGame$ = this.refreshSubject.pipe(switchMap(() => this.gameService.getGame({ id: this.gameId })));
    this.refreshAccount$ = this.refreshSubject.pipe(switchMap(() => this.accountService.getAccount({ id: this.accountId })));

    this.getGame$ = this.refreshGame$.pipe(shareReplay(1));
    this.getAccount$ = this.refreshAccount$.pipe(shareReplay(1));

    this.sub.add(this.addRoundSubject.pipe(
      tap(() => {
        this.overlaySubject.next(true);
        setTimeout(() => {
          this.overlaySubject.next(false);
        }, 500)
      }),
      throttleTime(500),
      switchMap((cardRequest) => this.accountService.getAccount({ id: this.accountId }).pipe(map(response => { return { balance: response.balance, card: cardRequest } }))),
      switchMap((response) => forkJoin([this.gameService.addNewRoundToGame({
        body: {
          card: {
            type: response.card.type,
            rewardValue: response.card.rewardValue,
            punishmentPercentChance: response.card.punishmentPercentChance,
            punishmentValueDefault: response.card.punishmentValueDefault,
            punishmentValueLower: response.card.punishmentValueLower,
            punishmentValueUpper: response.card.punishmentValueUpper
          },
          gameId: this.gameId,
          previousBalance: response.balance,
        }
      }),
      of(response.card)
      ])),
      tap(result => {
        if (!result[0].gameContinued) {
          sessionStorage.setItem('archived', '1');
          this.router.navigate(['summary']);
        }
      })
    ).subscribe((result) => {
      this.refreshSubject.next(true);
      setTimeout(() => {
        this.changeSubject.next(result[1]);
      })
    }
    ));

    this.roundTableDataSource$ = this.refreshSubject.pipe(
      switchMap(
        () => this.gameService.getGame({ id: this.gameId }).pipe(
          map(game => {
            const source = new MatTableDataSource<RoundResponse>();
            source.data = game.rounds ?? [];
            source.paginator = this.paginator;
            return source;
          }),
          tap(source => {
            source.data = source.data.sort((a, b) => {
              return (a.roundNumber! > b.roundNumber! ? -1 : 1);
            });
            return source;
          })
        )));
  }

  ngAfterContentInit(): void {
    this.openDialog();
    this.refreshSubject.next(true);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getChange(): Observable<{ first: number, second: number }> {
    return zip(this.changeSubject, this.getAccount$).pipe(map(response => {
      var first = response[0].rewardValue!;
      var second = Math.abs((response[1].balance! - response[1].previousBalance!) - response[0]!.rewardValue!)
      return { first, second };
    }));
  }

  getOverlay(): Observable<boolean> {
    return this.overlaySubject.asObservable();
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['login']);
  }

  addRound(cardRequest: CardRequest) {
    this.addRoundSubject.next(cardRequest);
  }

  openDialog(): void {
    this.dialog.open(RulesComponent, {
      disableClose: true,
      width: window.innerWidth < 960 ? '100%' : '60%'
    })
  }
}
