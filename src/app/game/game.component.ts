import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

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
export class GameComponent implements AfterViewInit{

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public cardImageSources: string[] = [
    "assets/spades.svg",
    "assets/clubs.svg",
    "assets/diamonds.svg",
    "assets/hearts.svg",
  ]

  private roundTableData = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  public roundTableDataSource = new MatTableDataSource(this.roundTableData);

  ngAfterViewInit(): void {
    this.roundTableDataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
}
