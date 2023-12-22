/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GameResponse } from '../../models/game-response';

export interface GetGame$Params {
  id: string;
}

export function getGame(http: HttpClient, rootUrl: string, params: GetGame$Params, context?: HttpContext): Observable<StrictHttpResponse<GameResponse>> {
  const rb = new RequestBuilder(rootUrl, getGame.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {"style":"simple"});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GameResponse>;
    })
  );
}

getGame.PATH = '/api/Game/{id}';
