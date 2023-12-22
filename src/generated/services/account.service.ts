/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AccountResponse } from '../models/account-response';
import { getAccount } from '../fn/account/get-account';
import { GetAccount$Params } from '../fn/account/get-account';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getAccount()` */
  static readonly GetAccountPath = '/api/Account/{id}';

  /**
   * Returns an account by its id, if the account does not exist a new one is returned.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAccount()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAccount$Response(params: GetAccount$Params, context?: HttpContext): Observable<StrictHttpResponse<AccountResponse>> {
    return getAccount(this.http, this.rootUrl, params, context);
  }

  /**
   * Returns an account by its id, if the account does not exist a new one is returned.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAccount$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAccount(params: GetAccount$Params, context?: HttpContext): Observable<AccountResponse> {
    return this.getAccount$Response(params, context).pipe(
      map((r: StrictHttpResponse<AccountResponse>): AccountResponse => r.body)
    );
  }

}
