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
        path: '**',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
