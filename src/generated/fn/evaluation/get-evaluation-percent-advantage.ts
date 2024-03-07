/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvaluationPercentAdvantageResponse } from '../../models/evaluation-percent-advantage-response';

export interface GetEvaluationPercentAdvantage$Params {
  id: string;
}

export function getEvaluationPercentAdvantage(http: HttpClient, rootUrl: string, params: GetEvaluationPercentAdvantage$Params, context?: HttpContext): Observable<StrictHttpResponse<EvaluationPercentAdvantageResponse>> {
  const rb = new RequestBuilder(rootUrl, getEvaluationPercentAdvantage.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {"style":"simple"});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'text/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<EvaluationPercentAdvantageResponse>;
    })
  );
}

getEvaluationPercentAdvantage.PATH = '/api/Evaluation/percent/{id}';
