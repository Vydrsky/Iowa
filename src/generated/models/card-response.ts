/* tslint:disable */
/* eslint-disable */
import { CardType } from '../models/card-type';
export interface CardResponse {
  punishmentPercentChance?: number;
  punishmentValueLower?: number;
  punishmentValueUpper?: number;
  rewardValue?: number;
  type?: CardType;
}
