import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

import { CreateAuditComponent } from './pages/audit/create/create-audit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditorComponent } from './pages/auditor/create/create-auditor.component';
import { ListAuditComponent } from './pages/audit/list/list-audit.component';
import { ExperienceComponent } from './pages/auditor/experience/experience.component';
import { EditPucLegComponent } from './pages/puc/edit-puc-leg/edit-puc-leg.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'AUDITOR'] }
  },
  {
    path: 'audit',
    component: CreateAuditComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'audits',
    component: ListAuditComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'auditor',
    component: AuditorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'auditor-experience',
    component: ExperienceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'AUDITOR'] }
  },
  {
    path: 'audit-items',
    component: EditPucLegComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: '**', 
    pathMatch: 'full', 
    redirectTo: 'login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
