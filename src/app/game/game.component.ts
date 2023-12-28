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
import { CookieService } from 'ngx-cookie-service';
import { AccountService, GameService, UserService } from '../../generated/services';
import { AccountResponse, CardRequest, GameResponse, RoundResponse } from '../../generated/models';
import { BehaviorSubject, Observable, debounce, debounceTime, distinctUntilChanged, map, of, skip, switchMap, take, tap, throttle, throttleTime, throwError, } from 'rxjs';
import { NormalizeNumberPipe } from '../common/pipes/normalize-number.pipe';

@Component({
  selector: 'app-game',
  standalone: true,
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
    NormalizeNumberPipe
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
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
    "0": 'assets/spades.svg',
    "1": 'assets/clubs.svg',
    "2": 'assets/diamonds.svg',
    "3": 'assets/hearts.svg',
  }
  public roundTableDataSource$ = new Observable<MatTableDataSource<RoundResponse>>();

  public displayedColumns: string[] = ['roundNumber', 'previousBalance', 'total', 'change'];

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private gameService: GameService,
    private accountService: AccountService,
    private userService: UserService) { }

  ngOnInit(): void {
    if (this.isUserArchived()) {
      this.router.navigate(['summary']);
    }

    var gameId = this.cookieService.get('gameId');
    var accountId = this.cookieService.get('accountId');

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
  }

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['login']);
    this.cookieService.deleteAll();
  }

  isUserArchived(): boolean {
    var userId = this.cookieService.get('userId');
    var archived = true;
    this.userService
      .getUser({ id: userId})
      .pipe(take(1))
      .subscribe(response => {
        archived = response?.isArchived ?? true;
      })
    return archived;
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
      throttleTime(200),
      take(1),
      switchMap(result => {
        if (!result.gameContinued) {
          this.cookieService.set('archived', '1');
          this.router.navigate(['summary']);
        }
        return of(result);
      })).subscribe((response) => {
        this.updateState();
      });
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
