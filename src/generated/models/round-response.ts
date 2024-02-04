/* tslint:disable */
/* eslint-disable */
import { CardType } from '../models/card-type';
export interface RoundResponse {
  id?: string;
  previousBalance?: number;
  roundNumber?: number;
  total?: number;
  type?: CardType;
  won?: boolean;
}
