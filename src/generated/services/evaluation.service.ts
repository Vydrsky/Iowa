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
import { getAllEvaluations } from '../fn/evaluation/get-all-evaluations';
import { GetAllEvaluations$Params } from '../fn/evaluation/get-all-evaluations';

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

}
