import { NgModule, isDevMode, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServiceWorkerModule } from '@angular/service-worker';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateAuditComponent } from './pages/audit/create/create-audit.component';
import { ListAuditComponent } from './pages/audit/list/list-audit.component';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditorComponent } from './pages/auditor/create/create-auditor.component';
import { ExperienceComponent } from './pages/auditor/experience/experience.component';
import { EditItemComponent } from './pages/edit-items/edit-item.component';
import { EditAuditComponent } from './components/edit-audit/edit-audit.component';
import { LoginComponent } from './pages/login/login.component';
import { CkeditorComponent } from './components/ckeditor/ckeditor.component';
import { AuditReportComponent } from './pages/reports/audit-report/audit-report.component';
import { PageDescriptionComponent } from './components/page-description/page-description.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateAuditComponent,
    ListAuditComponent,
    NavbarComponent,
    DashboardComponent,
    AuditorComponent,
    ExperienceComponent,
    EditItemComponent,
    EditAuditComponent,
    LoginComponent, 
    CkeditorComponent,
    AuditReportComponent,
    PageDescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    CKEditorModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
