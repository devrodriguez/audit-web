import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { GoalItem } from 'src/app/interfaces/goal-item';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GoalsService } from 'src/app/services/goals.service';

const TYPE_CLASS = 'class'
const TYPE_GROUP = 'group'
const TYPE_ACCOUNT = 'account'
const TYPE_SUB_ACCOUNT = 'sub_account'
const AUDIT_STATUS_PENDING = 'pending'

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.scss']
})
export class CreateAuditComponent implements OnInit {
  public isEditState: boolean = false
  public audits: Audit[] = []
  public auditors: Auditor[] = []
  public enterprises: Enterprise[] = []
  public goalItems: GoalItem[] = []
  public selectedGoalItems: GoalItem[] = []
  public newAudit: Audit = {} as Audit
  public selectedEnterp: Enterprise = {} as Enterprise
  public defaultAuditor: Auditor = {} as Auditor

  @ViewChild('matEntpRef') matEntpRef: MatSelect;
  
  // public filteredGoalItems$: Observable<GoalItem[]>
  public auditorsList$: Observable<Auditor[]>
  public enterprisesList$: Observable<Auditor[]>
  public auditsList$: Observable<Audit[]>;
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
    this.loadAudits()
  }

  getAccounts() {
    this.goalSrv.getGoalItemsByType(TYPE_ACCOUNT).subscribe(gi => {
      this.goalItems = gi
    })
  }

  initializeAudit() {
    if(!this.newAudit.enterprise.id) {
      this.presentSnackBar('Enterprise is required!')
      return
    }

    if(this.audits.find(audit => audit.enterprise.id == this.newAudit.enterprise.id && audit.status === AUDIT_STATUS_PENDING)) {
      this.presentSnackBar('Audit for enterprise already exist!')
      return
    }

    this.isEditState = true
    this.addAudit()
  }

  loadAudits() {
    this.auditsList$ = this.auditSrv.getAudits()
    this.auditSrv.getAudits().subscribe(audits => {
      this.audits = audits
    })
  }

  addAudit() {
    //this.newAudit.enterprise = this.selectedEnterp
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

  editAudit(audit: Audit) {
    this.isEditState = true
    this.newAudit = audit
  }

  saveAudit() {
    this.auditSrv
    .updateAudit(this.newAudit)
    .then(res => {
      this.isEditState = false
      this.presentSnackBar('Audit saved!')
    })
    .catch(err => {
      console.error(err)
    })
  }

  closeEdition() {
    this.isEditState = false
    this.matEntpRef.options.forEach((data: MatOption) => data.deselect());
  }

  /** Utils */
  compareEnterprise(x: Enterprise, y: Enterprise): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  /** Event Components */
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
