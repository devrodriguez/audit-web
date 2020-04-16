import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAuditComponent } from './pages/create-audit/create-audit.component';


const routes: Routes = [
  {
    path: 'audit',
    component: CreateAuditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
