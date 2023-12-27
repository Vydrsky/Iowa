import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { AccountService, GameService } from '../../generated/services';
import { AccountResponse, CardRequest, GameResponse } from '../../generated/models';
import { BehaviorSubject, debounce, debounceTime, interval, take } from 'rxjs';

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
    MatPaginatorModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public cardImageSources: { [key: string]: string } = {
    "0": 'assets/spades.svg',
    "1": 'assets/clubs.svg',
    "2": 'assets/diamonds.svg',
    "3": 'assets/hearts.svg',
  }

  public gameSubject = new BehaviorSubject<GameResponse>({});
  public accountSubject = new BehaviorSubject<AccountResponse>({});

  private roundTableData = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  public roundTableDataSource = new MatTableDataSource(this.roundTableData);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private gameService: GameService,
    private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.updateState();
  }

  ngAfterViewInit(): void {
    this.roundTableDataSource.paginator = this.paginator;
  }

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['login']);
    localStorage.clear();
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
    }).subscribe(response => {
      this.updateState();
    });
  }

  updateState() {
    this.gameService.getGame({
      id: localStorage.getItem('gameId') ?? ''
    }).subscribe(response => {
      this.gameSubject.next(response);
      console.log(this.gameSubject.value);
    });
    this.accountService.getAccount({
      id: localStorage.getItem('accountId') ?? ''
    }).subscribe(response => {
      this.accountSubject.next(response);
    });
  }
}
