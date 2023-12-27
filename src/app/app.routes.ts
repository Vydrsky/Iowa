import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => 
            import('./login/login.component').then(c => c.LoginComponent),
    },
    {
        path: 'game',
        loadComponent: () => 
            import('./game/game.component').then(c => c.GameComponent),
    },
    {
        path: 'summary',
        loadComponent: () => 
            import('./summary/summary.component').then(c => c.SummaryComponent),
    },
    {
        path: 'evaluations',
        loadComponent: () => 
            import('./evaluations/evaluations.component').then(c => c.EvaluationsComponent),
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
