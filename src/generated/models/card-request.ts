/* tslint:disable */
/* eslint-disable */
import { CardType } from '../models/card-type';
export interface CardRequest {
  punishmentPercentChance?: number;
  punishmentValueLower?: number;
  punishmentValueUpper?: number;
  rewardValue?: number;
  type?: CardType;
}
