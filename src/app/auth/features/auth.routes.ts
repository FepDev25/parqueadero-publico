import { Routes } from "@angular/router";
import { RoleGuard } from "../role.guard";

export default [
    {
        path : 'sign-in',
        loadComponent: () => import('./sign-in/sign-in.component')
    },
    {
        path : 'sign-up',
        loadComponent: () => import('./sign-up/sign-up.component')
    },
    {
        path: 'cajero-dashboard',
        loadComponent: () => import('./cajero-dashboard/cajero-dashboard.component').then(m => m.CajeroDashboardComponent),
        canActivate: [RoleGuard],
        data: { role: 'cajero' }
    },
    {
        path: 'usuario-dashboard',
        loadComponent: () => import('./usuario-dashboard/usuario-dashboard.component').then(m => m.UsuarioDashboardComponent),
        canActivate: [RoleGuard],
        data: { role: 'usuario' } // Solo accesible por usuarios
    }
] as Routes;