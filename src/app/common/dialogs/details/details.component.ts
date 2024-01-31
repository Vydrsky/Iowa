import { AfterContentInit, Component, Inject, OnDestroy, OnInit, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardTypePipe } from "../../pipes/card-type.pipe";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, ReplaySubject, Subscribable, Subscription, map, switchMap, tap } from 'rxjs';
import { RoundResponse } from '../../../../generated/models';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { GameService } from '../../../../generated/services';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [
    MatButtonModule,
    CardTypePipe,
    MatTableModule,
    CommonModule
  ]
})
export class DetailsComponent implements AfterContentInit, OnDestroy {

  private dataSource = new ReplaySubject<MatTableDataSource<RoundResponse, MatPaginator>>(1);
  private sub = new Subscription();

  public data$: Observable<MatTableDataSource<RoundResponse, MatPaginator>>
  public displayedColumns: string[] = ['roundNumber', 'previousBalance', 'total', 'change', 'type', 'won'];

  constructor(
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.data$ = this.dataSource.pipe(
      switchMap(() => this.gameService.getGame({ id: this.data.id })),
      map(response => {
        const source = new MatTableDataSource<RoundResponse>();
        source.data = response.rounds ?? []
        return source;
      }),
      tap(source => {
        source.data = source.data.sort((a, b) => {
          return (a.roundNumber! < b.roundNumber! ? -1 : 1);
        });
        return source;
      }));
  }

  ngAfterContentInit(): void {
    this.dataSource.next(new MatTableDataSource());
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
