import { AfterContentInit, Component, Inject, OnInit, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardTypePipe } from "../../pipes/card-type.pipe";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { RoundResponse } from '../../../../generated/models';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';

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
export class DetailsComponent implements AfterContentInit {

  private dataSource = new ReplaySubject<MatTableDataSource<RoundResponse, MatPaginator>>(1);

  public data$: Observable<MatTableDataSource<RoundResponse, MatPaginator>>
  public displayedColumns: string[] = ['roundNumber', 'previousBalance', 'total', 'change', 'type', 'won'];

  constructor(
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() : void {
    this.data$ = this.dataSource.pipe(
      
    )
  }

  ngAfterContentInit(): void {
    
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
