import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardTypePipe } from "../../pipes/card-type.pipe";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, ReplaySubject, Subscribable, Subscription, map, switchMap, tap } from 'rxjs';
import { CardType, RoundResponse } from '../../../../generated/models';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { GameService } from '../../../../generated/services';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [
    MatButtonModule,
    CardTypePipe,
    MatTableModule,
    CommonModule,
    ClipboardModule
  ],
  providers: [
    CardTypePipe
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
    private gameService: GameService,
    private cardTypePipe: CardTypePipe
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

  copyData(data: RoundResponse[]) {
    let content = "";
    data.forEach(row => {
      content += this.RoundToExcelFormat(row)
    })
    return content;
  }

  RoundToExcelFormat(obj: RoundResponse): string {
    let result = "";
    Object.keys(obj).forEach((key, index) => {
      if(key === 'id'){

      }
      else if(key === 'type'){
        result += this.cardTypePipe.transform(Number(obj[key])) + '\t';
      }
      else if(key === 'won'){
        result += (obj[key] ? 'Tak' : 'Nie') + '\t'
      }
      else{
        result += ((obj as {[x:string]:any})[key]).toString() + ',\t';
      }
    });
    result += (obj.total! - obj.previousBalance!).toString() + ',\t';
    return result + "\n";
  }
}
