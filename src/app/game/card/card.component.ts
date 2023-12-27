import { Component, HostListener, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
   @Input() source: string;

   public hoverBackground: string = ''

   public  onMouseEnter(){
      this.hoverBackground = 'hover-bg'
   }
   
   public onMouseLeave(){
    this.hoverBackground = ''
 }
}
