/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddNewRoundResponse } from '../../models/add-new-round-response';
import { AddNewRoundToGameRequest } from '../../models/add-new-round-to-game-request';

export interface AddNewRoundToGame$Params {
      body?: AddNewRoundToGameRequest
}

export function addNewRoundToGame(http: HttpClient, rootUrl: string, params?: AddNewRoundToGame$Params, context?: HttpContext): Observable<StrictHttpResponse<AddNewRoundResponse>> {
  const rb = new RequestBuilder(rootUrl, addNewRoundToGame.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'text/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<AddNewRoundResponse>;
    })
  );
}

addNewRoundToGame.PATH = '/api/Game';
