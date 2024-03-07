/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { EvaluationResponse } from '../models/evaluation-response';
import { EvaluationSummaryRangeResponse } from '../models/evaluation-summary-range-response';
import { getAllEvaluations } from '../fn/evaluation/get-all-evaluations';
import { GetAllEvaluations$Params } from '../fn/evaluation/get-all-evaluations';
import { getEvaluationPercentAdvantage } from '../fn/evaluation/get-evaluation-percent-advantage';
import { GetEvaluationPercentAdvantage$Params } from '../fn/evaluation/get-evaluation-percent-advantage';
import { getEvaluationSummaryRange } from '../fn/evaluation/get-evaluation-summary-range';
import { GetEvaluationSummaryRange$Params } from '../fn/evaluation/get-evaluation-summary-range';

@Injectable({ providedIn: 'root' })
export class EvaluationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getAllEvaluations()` */
  static readonly GetAllEvaluationsPath = '/api/Evaluation';

  /**
   * Returns a list of all evaluations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllEvaluations()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllEvaluations$Response(params?: GetAllEvaluations$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<EvaluationResponse>>> {
    return getAllEvaluations(this.http, this.rootUrl, params, context);
  }

  /**
   * Returns a list of all evaluations.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllEvaluations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllEvaluations(params?: GetAllEvaluations$Params, context?: HttpContext): Observable<Array<EvaluationResponse>> {
    return this.getAllEvaluations$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<EvaluationResponse>>): Array<EvaluationResponse> => r.body)
    );
  }

  /** Path part for operation `getEvaluationPercentAdvantage()` */
  static readonly GetEvaluationPercentAdvantagePath = '/api/Evaluation/percent/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEvaluationPercentAdvantage()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEvaluationPercentAdvantage$Response(params: GetEvaluationPercentAdvantage$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return getEvaluationPercentAdvantage(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getEvaluationPercentAdvantage$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEvaluationPercentAdvantage(params: GetEvaluationPercentAdvantage$Params, context?: HttpContext): Observable<number> {
    return this.getEvaluationPercentAdvantage$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getEvaluationSummaryRange()` */
  static readonly GetEvaluationSummaryRangePath = '/api/Evaluation/summary/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEvaluationSummaryRange()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEvaluationSummaryRange$Response(params: GetEvaluationSummaryRange$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<EvaluationSummaryRangeResponse>>> {
    return getEvaluationSummaryRange(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getEvaluationSummaryRange$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEvaluationSummaryRange(params: GetEvaluationSummaryRange$Params, context?: HttpContext): Observable<Array<EvaluationSummaryRangeResponse>> {
    return this.getEvaluationSummaryRange$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<EvaluationSummaryRangeResponse>>): Array<EvaluationSummaryRangeResponse> => r.body)
    );
  }

}
