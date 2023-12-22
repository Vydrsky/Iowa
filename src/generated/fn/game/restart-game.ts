/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GameResponse } from '../../models/game-response';

export interface RestartGame$Params {
  id: string;
}

export function restartGame(http: HttpClient, rootUrl: string, params: RestartGame$Params, context?: HttpContext): Observable<StrictHttpResponse<GameResponse>> {
  const rb = new RequestBuilder(rootUrl, restartGame.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {"style":"simple"});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'text/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GameResponse>;
    })
  );
}

restartGame.PATH = '/api/Game/{id}';
