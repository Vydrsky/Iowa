import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AccountService, GameService, UserService } from '../../generated/services';
import { AccountResponse, CardRequest, GameResponse, RoundResponse } from '../../generated/models';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, debounce, debounceTime, delay, distinctUntilChanged, map, of, pipe, share, skip, switchMap, take, tap, throttle, throttleTime, throwError, } from 'rxjs';
import { NormalizeNumberPipe } from '../common/pipes/normalize-number.pipe';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RulesComponent } from '../common/dialogs/rules/rules.component';
import { CardTypePipe } from "../common/pipes/card-type.pipe";

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
    ]
})
export class GameComponent implements AfterContentInit, OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  private refreshSubject = new ReplaySubject<boolean>(1);
  private addRoundSubject = new ReplaySubject<CardRequest>(1);
  private changeSubject = new ReplaySubject<CardRequest>(1);
  private gameId: string;
  private accountId: string;
  public getAccountShare$: Observable<AccountResponse>;
  public getGameShare$: Observable<GameResponse>;
  private sub = new Subscription();

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

    this.getGameShare$ = this.gameService.getGame({ id: this.gameId }).pipe(share());
    this.getAccountShare$ = this.accountService.getAccount({ id: this.accountId }).pipe(share());

    this.getGame$ = this.refreshSubject.pipe(
      switchMap(() => this.getGameShare$)
    )

    this.getAccount$ = this.refreshSubject.pipe(
      switchMap(() => this.getAccountShare$)
    )

    this.sub.add(this.addRoundSubject.pipe(
      throttleTime(500),
      tap((cardRequest) => this.changeSubject.next(cardRequest)),
      switchMap((cardRequest) => this.getAccountShare$.pipe(map(response => { return { balance: response.balance, card: cardRequest } }))),
      switchMap((response) => this.gameService.addNewRoundToGame({
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
      })),
      tap(result => {
        if (!result.gameContinued) {
          sessionStorage.setItem('archived', '1');
          this.router.navigate(['summary']);
        }
      })
    ).subscribe(() => this.updateState()));

    this.roundTableDataSource$ = this.getGame$.pipe(
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
    );
  }

  ngAfterContentInit(): void {
    this.openDialog();
    this.updateState();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
  getChange() : Observable<CardRequest> {
    return this.changeSubject.asObservable();
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

  updateState() {
    this.refreshSubject.next(true);
  }
}
