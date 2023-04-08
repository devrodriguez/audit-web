import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { QuillModule } from 'ngx-quill'

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateAuditComponent } from './pages/audit/create/create-audit.component';
import { ListAuditComponent } from './pages/audit/list/list-audit.component';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditorComponent } from './pages/auditor/create/create-auditor.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';
import { ExperienceComponent } from './pages/auditor/experience/experience.component';
import { AuditViewComponent } from './components/audit-view/audit-view.component';
import { EditPucLegComponent } from './pages/puc/edit-puc-leg/edit-puc-leg.component';
import { EditAuditComponent } from './components/edit-audit/edit-audit.component';
import { LoginComponent } from './pages/login/login.component';
import { EditorComponent } from './components/editor/editor.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    CreateAuditComponent,
    ListAuditComponent,
    NavbarComponent,
    DashboardComponent,
    AuditorComponent,
    GoalFormComponent,
    ExperienceComponent,
    AuditViewComponent,
    EditPucLegComponent,
    EditAuditComponent,
    LoginComponent, 
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    QuillModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
