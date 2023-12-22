/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addNewRoundToGame } from '../fn/game/add-new-round-to-game';
import { AddNewRoundToGame$Params } from '../fn/game/add-new-round-to-game';
import { GameResponse } from '../models/game-response';
import { getGame } from '../fn/game/get-game';
import { GetGame$Params } from '../fn/game/get-game';
import { restartGame } from '../fn/game/restart-game';
import { RestartGame$Params } from '../fn/game/restart-game';

@Injectable({ providedIn: 'root' })
export class GameService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getGame()` */
  static readonly GetGamePath = '/api/Game/{id}';

  /**
   * Returns a game for the user, or creates a new one if it did not exist.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGame()` instead.
   *
   * This method doesn't expect any request body.
   */
  getGame$Response(params: GetGame$Params, context?: HttpContext): Observable<StrictHttpResponse<GameResponse>> {
    return getGame(this.http, this.rootUrl, params, context);
  }

  /**
   * Returns a game for the user, or creates a new one if it did not exist.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getGame$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getGame(params: GetGame$Params, context?: HttpContext): Observable<GameResponse> {
    return this.getGame$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameResponse>): GameResponse => r.body)
    );
  }

  /** Path part for operation `restartGame()` */
  static readonly RestartGamePath = '/api/Game/{id}';

  /**
   * Restores game to initial state.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `restartGame()` instead.
   *
   * This method doesn't expect any request body.
   */
  restartGame$Response(params: RestartGame$Params, context?: HttpContext): Observable<StrictHttpResponse<GameResponse>> {
    return restartGame(this.http, this.rootUrl, params, context);
  }

  /**
   * Restores game to initial state.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `restartGame$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  restartGame(params: RestartGame$Params, context?: HttpContext): Observable<GameResponse> {
    return this.restartGame$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameResponse>): GameResponse => r.body)
    );
  }

  /** Path part for operation `addNewRoundToGame()` */
  static readonly AddNewRoundToGamePath = '/api/Game';

  /**
   * Adds new round to the game. This invokes many domain events that control the flow of the game forwards.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addNewRoundToGame()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewRoundToGame$Response(params?: AddNewRoundToGame$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return addNewRoundToGame(this.http, this.rootUrl, params, context);
  }

  /**
   * Adds new round to the game. This invokes many domain events that control the flow of the game forwards.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addNewRoundToGame$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewRoundToGame(params?: AddNewRoundToGame$Params, context?: HttpContext): Observable<void> {
    return this.addNewRoundToGame$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
