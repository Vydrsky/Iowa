import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { BehaviorSubject, Observable, debounce, debounceTime, distinctUntilChanged, map, of, skip, switchMap, take, tap, throttle, throttleTime, throwError, } from 'rxjs';
import { NormalizeNumberPipe } from '../common/pipes/normalize-number.pipe';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RulesComponent } from '../common/dialogs/rules/rules.component';
import { CardTypePipe } from "../common/pipes/card-type.pipe";
import RoundTable from '../common/types/RoundTable';

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
        CardTypePipe
    ]
})
export class GameComponent implements AfterContentInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private getAccount$: Observable<AccountResponse>;

  private getGame$: Observable<GameResponse>;

  private gameSubject = new BehaviorSubject<GameResponse>({});

  private accountSubject = new BehaviorSubject<AccountResponse>({});

  public get game(): Observable<GameResponse> {
    return this.gameSubject.asObservable();
  }

  public get account(): Observable<AccountResponse> {
    return this.accountSubject.asObservable();
  }

  public cardImageSources: { [key: string]: string } = {
    "0": 'assets/basic-card.svg',
    "1": 'assets/basic-card.svg',
    "2": 'assets/basic-card.svg',
    "3": 'assets/basic-card.svg',
  }
  public roundTableDataSource$ = new Observable<MatTableDataSource<RoundResponse>>();

  public displayedColumns: string[] = ['roundNumber', 'previousBalance', 'total', 'change', 'type'];

  constructor(
    private router: Router,
    private gameService: GameService,
    private accountService: AccountService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    var gameId = sessionStorage.getItem('gameId') ?? '';
    var accountId = sessionStorage.getItem('accountId') ?? '';

    this.getGame$ = this.gameService.getGame({
      id: gameId
    }).pipe(distinctUntilChanged(), take(1));

    this.getAccount$ = this.accountService.getAccount({
      id: accountId
    }).pipe(distinctUntilChanged(), take(1));

    this.updateState();
  }

  ngAfterContentInit(): void {
    this.roundTableDataSource$ = this.game.pipe(
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
    this.openDialog();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  addRound(cardRequest: CardRequest) {
    this.gameService.addNewRoundToGame({
      body: {
        card: {
          type: cardRequest.type,
          rewardValue: cardRequest.rewardValue,
          punishmentPercentChance: cardRequest.punishmentPercentChance,
          punishmentValueLower: cardRequest.punishmentValueLower,
          punishmentValueUpper: cardRequest.punishmentValueUpper
        },
        gameId: this.gameSubject.value.id,
        previousBalance: this.accountSubject.value.balance,
      }
    }).pipe(
      take(1),
      switchMap(result => {
        if (!result.gameContinued) {
          sessionStorage.setItem('archived', '1');
          this.router.navigate(['summary']);
        }
        return of(result);
      })).subscribe(() => {
        this.updateState();
      });
  }

  openDialog(): void {
    this.dialog.open(RulesComponent, {
      disableClose: true,
      width: window.innerWidth < 960 ? '100%' : '60%'
    })
  }

  updateState() {
    this.getGame$.subscribe(response => {
      this.gameSubject.next(response);
    })

    this.getAccount$.subscribe(response => {
      this.accountSubject.next(response);
    })
  }
}
