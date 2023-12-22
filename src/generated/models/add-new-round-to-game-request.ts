/* tslint:disable */
/* eslint-disable */
import { CardRequest } from '../models/card-request';
export interface AddNewRoundToGameRequest {
  card?: CardRequest;
  gameId?: string;
  previousBalance?: number;
}
