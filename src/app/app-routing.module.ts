import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAuditComponent } from './pages/audit/create/create-audit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditorComponent } from './pages/auditor/auditor.component';
import { ListAuditComponent } from './pages/audit/list/list-audit.component';
import { ExperienceComponent } from './pages/auditor/experience/experience.component';

const routes: Routes = [
  {
    path: 'audit',
    component: CreateAuditComponent
  },
  {
    path: 'audits',
    component: ListAuditComponent
  },
  {
    path: 'auditor',
    component: AuditorComponent
  },
  {
    path: 'auditor/experience',
    component: ExperienceComponent
  },
  {
    path: '**',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
