import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CardRequest, CardResponse } from '../../../generated/models';
import { CardTypePipe } from "../../common/pipes/card-type.pipe";
@Component({
    selector: 'app-card',
    standalone: true,
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    imports: [MatCardModule, CardTypePipe]
})
export class CardComponent {
  @Input() imageSource: string;

  @Input() cardData: CardResponse;

  @Output() addRound = new EventEmitter<CardRequest>()

  public hoverBackground: string = ''

  public onMouseEnter() {
    this.hoverBackground = 'hover-bg'
  }

  public onMouseLeave() {
    this.hoverBackground = ''
  }

  public cardClicked() {
    console.log('clicked');
    this.addRound.emit(this.cardData);
  }
}
