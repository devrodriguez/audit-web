import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { Goal } from 'src/app/interfaces/goal';
import { GoalItem } from 'src/app/interfaces/goal-item';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GoalsService } from 'src/app/services/goals.service';

const TYPE_CLASS = 'class'
const TYPE_GROUP = 'group'
const TYPE_ACCOUNT = 'account'
const TYPE_SUB_ACCOUNT = 'sub_account'

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.scss']
})
export class CreateAuditComponent implements OnInit {
  public isNewAudit: boolean = false
  public auditors: Auditor[] = []
  public enterprises: Enterprise[] = []
  public newAudit: Audit = {} as Audit
  public goalItems: GoalItem[] = []
  public selectedGoalItems: GoalItem[] = []
  public selectedEnterp: Enterprise = {} as Enterprise
  
  // public filteredGoalItems$: Observable<GoalItem[]>
  public auditorsList$: Observable<Auditor[]>
  public enterprisesList$: Observable<Auditor[]>
  goalsAutoCtl = new FormControl('')

  constructor(
    private matSnackBar: MatSnackBar,
    private auditSrv: AuditService,
    private auditorSrv: AuditorService,
    private enterpriseSrv: EnterpriseService,
    private goalSrv: GoalsService) { }

  ngOnInit(): void {
    this.auditorsList$ = this.auditorSrv.getAuditors()
    this.enterprisesList$ = this.enterpriseSrv.getEnterprises()
    this.getAccounts()
  }

  getAccounts() {
    this.goalSrv.getGoalItemsByType(TYPE_ACCOUNT).subscribe(gi => {
      this.goalItems = gi
    })
  }

  initializeAudit() {
    if(!this.selectedEnterp.id) {
      this.presentSnackBar('Enterprise is required!')
      return
    }

    this.isNewAudit = true
    this.addAudit()
  }

  addAudit() {
    this.newAudit.enterprise = this.selectedEnterp
    this.newAudit.createdAt = new Date().toISOString()
    this.newAudit.status = 'pending'
    this.newAudit.goalItems = this.goalItems

    this.auditSrv
    .createAudit(this.newAudit)
    .then(docRef => {
      this.newAudit.id = docRef.id
      this.presentSnackBar('Auditoria creada correctamente')
    })
    .catch(err => {
      console.error(err);
      this.presentSnackBar('Error al crear auditoria')
    })
  }

  saveAudit() {
    this.auditSrv
    .updateAudit(this.newAudit)
    .then(res => {
      this.presentSnackBar('Audit saved!')
    })
    .catch(err => {
      console.error(err)
    })
  }

  /** Event Components */
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
