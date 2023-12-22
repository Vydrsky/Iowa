/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AccountResponse } from '../../models/account-response';

export interface GetAccount$Params {
  id: string;
}

export function getAccount(http: HttpClient, rootUrl: string, params: GetAccount$Params, context?: HttpContext): Observable<StrictHttpResponse<AccountResponse>> {
  const rb = new RequestBuilder(rootUrl, getAccount.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {"style":"simple"});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'text/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<AccountResponse>;
    })
  );
}

getAccount.PATH = '/api/Account/{id}';
