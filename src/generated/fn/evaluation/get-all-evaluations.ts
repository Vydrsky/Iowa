/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvaluationResponse } from '../../models/evaluation-response';

export interface GetAllEvaluations$Params {
}

export function getAllEvaluations(http: HttpClient, rootUrl: string, params?: GetAllEvaluations$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<EvaluationResponse>>> {
  const rb = new RequestBuilder(rootUrl, getAllEvaluations.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'text/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<EvaluationResponse>>;
    })
  );
}

getAllEvaluations.PATH = '/api/Evaluation';
