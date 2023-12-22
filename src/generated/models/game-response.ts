/* tslint:disable */
/* eslint-disable */
import { CardResponse } from '../models/card-response';
import { RoundResponse } from '../models/round-response';
export interface GameResponse {
  accountId?: string;
  cards?: Array<CardResponse> | null;
  id?: string;
  rounds?: Array<RoundResponse> | null;
  userId?: string;
}
