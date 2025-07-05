import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, startWith, takeUntil, map } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

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

import { AUDIT_STATUS_COMPLETED, AUDIT_STATUS_PENDING } from 'src/app/constants/audit-status';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.scss']
})
export class CreateAuditComponent implements OnInit, OnDestroy {
  @ViewChild('autoEnterprise') matEntpRef: MatAutocomplete;
  @ViewChild('autoItems') matItemsRef: MatAutocomplete;
  @ViewChild('stepper') stepper: MatStepper;

  /** Form Controls */
  auditTypeCtrl = new FormControl('', [Validators.required])
  enterpriseCtrl = new FormControl('', [Validators.required])

  /** State */
  public htmlData: string
  public isEditState: boolean = false
  public audits: Audit[] = []
  public auditors: Auditor[] = []
  public enterprises: Enterprise[] = []
  public auditItemTypes: AuditItemType[] = []
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
    private notifySrv: NotificationService,
    private auditSrv: AuditService,
    private auditorSrv: AuditorService,
    private enterpriseSrv: EnterpriseService,
    private goalSrv: GoalsService,
    private fileSrv: FileService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.auditorsList$ = this.auditorSrv.getAuditors()
    this.enterpriseSrv.getEnterprises()
      .pipe(takeUntil(this.destroyer$))
      .subscribe({
        next: (enterprises) => {
          this.enterprises = enterprises
          this.enterprisesList$ = this.enterpriseCtrl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterEnterprise(value || ''))
          )
        },
        error: (err) => {
          console.error(err)
        }
      })
    this.goalSrv.getAuditItemTypes()
      .pipe(takeUntil(this.destroyer$))
      .subscribe({
        next: (items) => {
          this.auditItemTypes = items
          this.auditItemTypes$ = this.auditTypeCtrl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterAuditItem(value || ''))
          )
        },
        error: (err) => {
          console.error(err)
        }
      })
    this.loadAudits()
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
    this.goalSrv
      .getGoalItemsByType(code)
      .pipe(takeUntil(this.destroyer$))
      .subscribe({
        next: (items) => {
          this.auditCandidate.goalItems = items
        },
        error: (err) => {
          console.error(err)
          this.notifySrv.showError('Error al cargar los items de la auditoría')
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
          this.notifySrv.showError('Error al cargar las auditorías')
        }
      })
  }

  /** Utils */
  compareEnterprise(x: Enterprise, y: Enterprise): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  private _filterAuditItem(value: string): AuditItemType[] {
    if (typeof value !== 'string') return [] as AuditItemType[]

    const filterValue = value?.toLowerCase();
    return this.auditItemTypes.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterEnterprise(value: string): Enterprise[] {
    if (typeof value !== 'string') return [] as Enterprise[]

    const filterValue = value?.toLowerCase();
    return this.enterprises.filter(option => option.name.toLowerCase().includes(filterValue));
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
      this.notifySrv.showWarning('Enterprise is required!')
      return
    }

    const foundAudit = this.audits.find(audit => audit.enterprise.id == this.auditCandidate.enterprise.id && audit.status === AUDIT_STATUS_PENDING)
    if (foundAudit) {
      this.notifySrv.showWarning(`Audit for enterprise ${this.auditCandidate.enterprise.name} already exist and is ${foundAudit.status}!`)
      return
    }

    if (!this.auditCandidate?.goalItems?.length) {
      this.notifySrv.showWarning('Audit items are required!')
      return
    }

    if (this.auditCandidate?.auditType?.id == null) {
      this.notifySrv.showWarning('Audit type is required!')
      return
    }

    this.auditCandidate.createdAt = new Date().getTime()
    this.auditCandidate.status = AUDIT_STATUS_PENDING

    this.auditSrv
      .createAudit(this.auditCandidate)
      .then(docRef => {
        this.auditCandidate = {} as Audit
        this.stepper.reset()
        this.notifySrv.showSuccess('Auditoria creada correctamente')
        /*
        this.enterpriseCtrl.setValue('')
        this.auditTypeCtrl.setValue('')
        this.matEntpRef.options.forEach(item => item.deselect())
        this.matItemsRef.options.forEach(item => item.deselect())
        */
      })
      .catch(err => {
        console.error(err);
        this.notifySrv.showError('Error al crear auditoria')
      })
  }

  onEditAudit(audit: Audit) {
    if (audit.status === AUDIT_STATUS_COMPLETED) return

    this.isEditState = true
    this.auditCandidate = audit
  }

  onCompleteAudit(audit: Audit) {
    const itemsWithNoAuditor = audit.goalItems.filter(item => item.auditor == null)
    if (itemsWithNoAuditor.length > 0) {
      this.notifySrv.showWarning('All items must have a assigned auditor!')
      return
    }

    if (!confirm(`Estas seguro de completar la auditoría ${audit?.enterprise?.name}`)) return

    audit.status = AUDIT_STATUS_COMPLETED
    audit.completedAt = new Date().getTime()

    this.auditSrv
      .upsertAudit(audit)
      .then(res => {
        this.notifySrv.showSuccess('Audit completed!')
      })
      .catch(err => {
        console.error(err)
        this.notifySrv.showError('Can not audit complete!')
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
      this.notifySrv.showSuccess('File attached!')
    } catch (err) {
      console.error(err)
      this.notifySrv.showError('Can not upload file!')
    }
  }

  async onDeleteFile({ file, gitem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      await this.auditSrv.upsertAudit(this.auditCandidate)
      this.notifySrv.showSuccess('File deleted!')
    } catch (err) {
      console.error(err)
      this.notifySrv.showError('Can not delete file!')
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
        this.notifySrv.showSuccess('Auditor updated!')
      })
      .catch(err => {
        console.error(err)
        this.notifySrv.showError('Can not update auditor!')
      })
  }
}
