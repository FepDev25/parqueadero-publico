import { Routes } from "@angular/router";
import { RoleGuard } from "../role.guard";
import { CajeroDashboardComponent } from "./cajero-dashboard/cajero-dashboard.component";
import { CajeroInicioComponent } from "./cajero-dashboard/cajero-inicio/cajero-inicio.component";
import { CajeroGestionEspaciosComponent } from "./cajero-dashboard/cajero-gestion-espacios/cajero-gestion-espacios.component";
import { CajeroGestionUsuariosComponent } from "./cajero-dashboard/cajero-gestion-usuarios/cajero-gestion-usuarios.component";
import { UsuarioDashboardComponent } from "./usuario-dashboard/usuario-dashboard.component";
import { UsuarioInicioComponent } from "./usuario-dashboard/usuario-inicio/usuario-inicio.component";
import { MiPerfilComponent } from "./usuario-dashboard/mi-perfil/mi-perfil.component";
import { UsuarioAdquirirContratosComponent } from "./usuario-dashboard/usuario-adquirir-contratos/usuario-adquirir-contratos.component";
import { CajeroGestionContratosComponent } from "./cajero-dashboard/cajero-gestion-contratos/cajero-gestion-contratos.component";
import { CajeroTarifaHorarioComponent } from "./cajero-dashboard/cajero-tarifa-horario/cajero-tarifa-horario.component";

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
        component: CajeroDashboardComponent,
        children: [
            { path: '', redirectTo: 'inicio-cajero', pathMatch: 'full' },
            { path: 'inicio-cajero', component: CajeroInicioComponent },
            { path: 'gestion-espacios', component: CajeroGestionEspaciosComponent },
            { path: 'gestion-usuarios', component: CajeroGestionUsuariosComponent },
            { path: 'gestion-contratos', component: CajeroGestionContratosComponent },
            { path: 'gestion-tarifa-hoario', component: CajeroTarifaHorarioComponent }
        ]
    },
    {
        path: 'usuario-dashboard',
        component: UsuarioDashboardComponent,
        children: [
            { path: '', redirectTo: 'inicio-usuario', pathMatch: 'full' },
            { path: 'inicio-usuario', component: UsuarioInicioComponent },
            { path: 'mi-perfil', component: MiPerfilComponent },
            { path: 'contratos-usuario', component: UsuarioAdquirirContratosComponent }
        ]
    }
] as Routes;
