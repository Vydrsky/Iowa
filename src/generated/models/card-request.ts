/* tslint:disable */
/* eslint-disable */
import { CardType } from '../models/card-type';
export interface CardRequest {
  cardType?: CardType;
  punishmentPercentChance?: number;
  punishmentValueLower?: number;
  punishmentValueUpper?: number;
  rewardValue?: number;
}
