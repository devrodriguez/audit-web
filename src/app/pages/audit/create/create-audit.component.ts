import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject, startWith, takeUntil, map } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { AuditItemType } from 'src/app/interfaces/goal-item';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GoalsService } from 'src/app/services/goals.service';
import { FileService } from 'src/app/services/file.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QuillEditorComponent } from 'ngx-quill';

import { AUDIT_STATUS_COMPLETED, AUDIT_STATUS_PENDING } from 'src/app/constants/audit-status';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.scss']
})
export class CreateAuditComponent implements OnInit, OnDestroy {
  @ViewChild('matEntpRef') matEntpRef: MatSelect
  @ViewChild('editor') editor: QuillEditorComponent

  /** Form Controls */
  auditTypeCtrl = new FormControl('', [Validators.required])
  enterpriseCtrl = new FormControl('', [Validators.required])

  /** State */
  public htmlData: string
  public isEditState: boolean = false
  public audits: Audit[] = []
  public auditors: Auditor[] = []
  public enterprises: Enterprise[] = []
  public goalItems: AuditItemType[] = []
  public selectedGoalItems: AuditItemType[] = []
  public auditCandidate: Audit = {} as Audit
  public defaultAuditor: Auditor = {} as Auditor

  /** Observables */
  public auditorsList$: Observable<Auditor[]>
  public enterprisesList$: Observable<Enterprise[]>
  public auditsList$: Observable<Audit[]>;
  public auditItemTypes$: Observable<AuditItemType[]>;
  
  destroyer$: Subject<void> = new Subject()

  constructor(
    private notificationService: NotificationService,
    private auditSrv: AuditService,
    private auditorSrv: AuditorService,
    private enterpriseSrv: EnterpriseService,
    private goalSrv: GoalsService,
    private fileSrv: FileService,
    private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.enterprisesList$ = this.enterpriseCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )
    this.auditItemTypes$ = this.auditTypeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )

    this.auditorsList$ = this.auditorSrv.getAuditors()
    this.loadAudits()
    this.enterprisesList$ = this.enterpriseSrv.getEnterprises()
    this.auditItemTypes$ = this.goalSrv.getAuditItemTypes()
  }

  ngOnDestroy(): void {
    this.destroyer$.next()
    this.destroyer$.complete()
  }

  firstFormGroup = this._formBuilder.group({
    enterprise: this.enterpriseCtrl,
  })
  secondFormGroup = this._formBuilder.group({
    itemType: this.auditTypeCtrl,
  })

  loadGoalItems(code: string): void {
    this.goalSrv.getGoalItemsByType(code)
    .pipe(takeUntil(this.destroyer$))
    .subscribe({
      next: (items)=>{
        this.auditCandidate.goalItems = items
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  loadAudits() {
    this.auditSrv.getAudits()
    .pipe(takeUntil(this.destroyer$))
    .subscribe({
      next: (audits) => {
        this.audits = audits
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  saveAudit() {
    this.auditSrv
      .upsertAudit(this.auditCandidate)
      .then(() => {
        this.notificationService.showSuccess('Audit saved!')
      })
      .catch(err => {
        console.error(err)
        this.notificationService.showError('Can not save audit!')
      })
  }

  /** Utils */
  compareEnterprise(x: Enterprise, y: Enterprise): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  private _filter(value: string): AuditItemType[] {
    const filterValue = value.toLowerCase();
    return this.auditCandidate.goalItems.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayEnterprise(enterprise: Enterprise): string {
    return enterprise?.name
  }

  displayAuditItem(auditItem: AuditItemType): string {
    return auditItem?.name
  }

  /** Events */
  onInitializeAudit() {
    if (!this.auditCandidate?.enterprise?.id) {
      this.notificationService.showWarning('Enterprise is required!')
      return
    }

    if (this.audits.find(audit => audit.enterprise.id == this.auditCandidate.enterprise.id && audit.status === AUDIT_STATUS_PENDING)) {
      this.notificationService.showWarning(`Audit for enterprise ${this.auditCandidate.enterprise.name} already exist!`)
      return
    }
    
    this.auditCandidate.createdAt = new Date().getTime()
    this.auditCandidate.status = AUDIT_STATUS_PENDING

    this.auditSrv
      .createAudit(this.auditCandidate)
      .then(docRef => {
        this.auditCandidate = {} as Audit
        this.notificationService.showSuccess('Auditoria creada correctamente')
      })
      .catch(err => {
        console.error(err);
        this.notificationService.showError('Error al crear auditoria')
      })
  }

  onEditAudit(audit: Audit) {
    if(audit.status === AUDIT_STATUS_COMPLETED) return

    this.isEditState = true
    this.auditCandidate = audit

    // set form values met-autocomplete
    
  }

  onCompleteAudit(audit: Audit) {
    if (!confirm(`Estas seguro de completar la auditoría ${audit?.enterprise?.name}`)) return

    audit.status = AUDIT_STATUS_COMPLETED

    this.auditSrv
      .upsertAudit(audit)
      .then(res => {
        this.notificationService.showSuccess('Audit completed!')
      })
      .catch(err => {
        console.error(err)
        this.notificationService.showError('Can not audit complete!')
      })
  }

  onCloseEdition() {
    this.isEditState = false
  }

  async onFileSelected({ $event, gitem }) {
    const file = $event.target.files[0]

    try {
      const upRes = await this.fileSrv.uploadFile(file)
      const fileItem = { name: upRes.ref.name, fullPath: upRes.ref.fullPath }

      gitem.files = gitem.files ? [...gitem.files, fileItem] : [fileItem]
      this.auditSrv.upsertAudit(this.auditCandidate)
      this.notificationService.showSuccess('File attached!')
    } catch (err) {
      console.error(err)
      this.notificationService.showError('Can not upload file!')
    }
  }

  async onDeleteFile({ file, gitem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      await this.auditSrv.upsertAudit(this.auditCandidate)
      this.notificationService.showSuccess('File deleted!')
    } catch (err) {
      console.error(err)
      this.notificationService.showError('Can not delete file!')
    }
  }

  onEnterpriseSelected(event: any) {
    this.auditCandidate.enterprise = event.option.value
  }

  onItemAuditChange(event: any) {
    const { code } = event.option.value
    this.auditCandidate.auditType = event.option.value
    this.loadGoalItems(code)
  }

  onItemAuditorCandidateChange({ event, index }) {
    this.auditCandidate.goalItems[index].auditor = event.value
  }

  onItemAuditorChange({ event, index }) {
    this.auditCandidate.goalItems[index].auditor = event.value
    this.auditSrv
      .upsertAudit(this.auditCandidate)
      .then(res => {
        this.notificationService.showSuccess('Auditor updated!')
      })
      .catch(err => {
        console.error(err)
        this.notificationService.showError('Can not update auditor!')
      })
  }
}
