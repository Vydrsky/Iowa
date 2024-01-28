import { Routes } from '@angular/router';
import { LoginGuard } from './common/guards/login.guard';
import { AdminGuard } from './common/guards/admin.guard';
import { LoggedInGuard } from './common/guards/logged-in.guard';
import { GameEndedGuard } from './common/guards/game-ended.guard';
import { GameContinuedGuard } from './common/guards/game-continued.guard';
import { SessionGuard } from './common/guards/session.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => 
            import('./login/login.component').then(c => c.LoginComponent),
        canActivate: [LoggedInGuard]
    },
    {
        path: 'game',
        loadComponent: () => 
            import('./game/game.component').then(c => c.GameComponent),
        canActivate: [LoginGuard, GameContinuedGuard, SessionGuard]
    },
    {
        path: 'summary',
        loadComponent: () => 
            import('./summary/summary.component').then(c => c.SummaryComponent),
        canActivate: [LoginGuard, GameEndedGuard, SessionGuard]
    },
    {
        path: 'evaluations',
        loadComponent: () => 
            import('./evaluations/evaluations.component').then(c => c.EvaluationsComponent),
        canActivate: [AdminGuard],
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
