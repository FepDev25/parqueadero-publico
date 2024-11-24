import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/features/auth.routes')
    },
    {
        path: '**',
        redirectTo: '', // Redirect to the homepage for any unmatched routes
        pathMatch: 'full'
    }
];
