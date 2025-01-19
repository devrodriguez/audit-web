import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

import { CreateAuditComponent } from './pages/audit/create/create-audit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditorComponent } from './pages/auditor/create/create-auditor.component';
import { ListAuditComponent } from './pages/audit/list/list-audit.component';
import { ExperienceComponent } from './pages/auditor/experience/experience.component';
import { EditItemComponent } from './pages/edit-items/edit-item.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { AuditReportComponent } from './pages/reports/audit-report/audit-report.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
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
    component: EditItemComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'audit-report',
    component: AuditReportComponent,
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
