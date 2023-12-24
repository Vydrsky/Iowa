import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject();
  private breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    .pipe(takeUntil(this.destroyed$))
  public containerClass: string = '';

  constructor(private breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
      this.breakpoint$.subscribe((state =>{
        if(this.breakpointObserver.isMatched(Breakpoints.Medium)){
          this.containerClass = 'container-medium'
        }
        else if(this.breakpointObserver.isMatched([Breakpoints.Large,Breakpoints.XLarge])) {
          this.containerClass = 'container-large'
        }
        else if(this.breakpointObserver.isMatched([Breakpoints.XSmall,Breakpoints.Small])){
          this.containerClass = 'container-mobile'
        }
      }));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete ();
  }
}
