import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccountService, EvaluationService } from '../../generated/services';
import { BehaviorSubject, map, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    MatCardModule,
    AsyncPipe
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  private evaluationsSubject = new BehaviorSubject<boolean>(false);
  private accountSubject = new BehaviorSubject<number>(0);

  public get passed() {
    return this.evaluationsSubject.asObservable();
  }

  public get balance() {
    return this.accountSubject.asObservable();
  }

  constructor(
    private evaluationService: EvaluationService, 
    private cookieService: CookieService,
    private accountService: AccountService) {}

  ngOnInit(): void {
    this.evaluationService.getAllEvaluations().pipe(
      take(1),
      map(response => response.find(e => e.userId == this.cookieService.get('userId'))?.isPassed ?? false)
      ).subscribe(response => {
      this.evaluationsSubject.next(response);
    });

    this.accountService.getAccount({
      id: this.cookieService.get('accountId')
    }).pipe(
      take(1),
      map(response => response.balance ?? 0)
    ).subscribe(response =>{
      this.accountSubject.next(response);
    })
  }

}
