import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAuditComponent } from './pages/audit/create/create-audit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditorComponent } from './pages/auditor/create/create-auditor.component';
import { ListAuditComponent } from './pages/audit/list/list-audit.component';
import { ExperienceComponent } from './pages/auditor/experience/experience.component';
import { EditPucLegComponent } from './pages/puc/edit-puc-leg/edit-puc-leg.component';
import { LoginComponent } from './pages/login/login.component';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'audit',
    component: CreateAuditComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'audits',
    component: ListAuditComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'auditor',
    component: AuditorComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'auditor/experience',
    component: ExperienceComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'puc/edit',
    component: EditPucLegComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
