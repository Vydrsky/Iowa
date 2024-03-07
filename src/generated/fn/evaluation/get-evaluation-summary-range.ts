/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EvaluationSummaryRangeResponse } from '../../models/evaluation-summary-range-response';

export interface GetEvaluationSummaryRange$Params {
  id: string;
}

export function getEvaluationSummaryRange(http: HttpClient, rootUrl: string, params: GetEvaluationSummaryRange$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<EvaluationSummaryRangeResponse>>> {
  const rb = new RequestBuilder(rootUrl, getEvaluationSummaryRange.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {"style":"simple"});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'text/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<EvaluationSummaryRangeResponse>>;
    })
  );
}

getEvaluationSummaryRange.PATH = '/api/Evaluation/summary/{id}';
