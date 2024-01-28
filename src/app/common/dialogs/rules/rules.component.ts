import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class RulesComponent {
  constructor(private dialogRef: MatDialogRef<RulesComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
