import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { GoalItem } from 'src/app/interfaces/goal-item';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GoalsService } from 'src/app/services/goals.service';
import { FileService } from 'src/app/services/file.service';
import { QuillEditorComponent } from 'ngx-quill';

import { AUDIT_STATUS_COMPLETED, AUDIT_STATUS_PENDING } from 'src/app/constants/audit-status';
import { TYPE_ACCOUNT } from 'src/app/constants/item-types';

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.scss']
})
export class CreateAuditComponent implements OnInit, OnDestroy {
  @ViewChild('matEntpRef') matEntpRef: MatSelect;
  @ViewChild('editor') editor: QuillEditorComponent;

  public htmlData: string
  public isEditState: boolean = false
  public audits: Audit[] = []
  public auditors: Auditor[] = []
  public enterprises: Enterprise[] = []
  public goalItems: GoalItem[] = []
  public selectedGoalItems: GoalItem[] = []
  public auditCandidate: Audit = {} as Audit
  public defaultAuditor: Auditor = {} as Auditor

  public auditorsList$: Observable<Auditor[]>
  public enterprisesList$: Observable<Enterprise[]>
  public auditsList$: Observable<Audit[]>;
  
  destroyer$: Subject<void> = new Subject()

  constructor(
    private matSnackBar: MatSnackBar,
    private auditSrv: AuditService,
    private auditorSrv: AuditorService,
    private enterpriseSrv: EnterpriseService,
    private goalSrv: GoalsService,
    private fileSrv: FileService) {}

  ngOnInit(): void {
    this.auditorsList$ = this.auditorSrv.getAuditors()
    this.enterprisesList$ = this.enterpriseSrv.getEnterprises()
    this.loadGoalItems()
    this.loadAudits()
  }

  ngOnDestroy(): void {
    this.destroyer$.next()
    this.destroyer$.complete()
  }

  loadGoalItems(): void {
    this.goalSrv.getGoalItemsByType(TYPE_ACCOUNT)
    .pipe(takeUntil(this.destroyer$))
    .subscribe({
      next: (items)=>{
        this.goalItems = items
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

  addAudit() {
    this.auditCandidate.createdAt = new Date().toISOString()
    this.auditCandidate.status = AUDIT_STATUS_PENDING
    this.auditCandidate.goalItems = this.goalItems

    this.auditSrv
      .createAudit(this.auditCandidate)
      .then(docRef => {
        this.auditCandidate.id = docRef.id
        this.presentSnackBar('Auditoria creada correctamente')
      })
      .catch(err => {
        console.error(err);
        this.presentSnackBar('Error al crear auditoria')
      })
  }

  saveAudit() {
    this.auditSrv
      .upsertAudit(this.auditCandidate)
      .then(() => {
        this.presentSnackBar('Audit saved!')
      })
      .catch(err => {
        console.error(err)
        this.presentSnackBar('Can not save audit!')
      })
  }

  /** Utils */
  compareEnterprise(x: Enterprise, y: Enterprise): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }

  /** Events */
  onInitializeAudit() {
    if (!this.auditCandidate?.enterprise?.id) {
      this.presentSnackBar('Enterprise is required!')
      return
    }

    if (this.audits.find(audit => audit.enterprise.id == this.auditCandidate.enterprise.id && audit.status === AUDIT_STATUS_PENDING)) {
      this.presentSnackBar(`Audit for enterprise ${this.auditCandidate.enterprise.name} already exist!`)
      return
    }

    this.isEditState = true
    this.addAudit()
  }

  onEditAudit(audit: Audit) {
    if(audit.status === AUDIT_STATUS_COMPLETED) return

    this.isEditState = true
    this.auditCandidate = audit
  }

  onCompleteAudit(audit: Audit) {
    if (!confirm(`Estas seguro de completar la auditoría ${audit?.enterprise?.name}`)) return

    audit.status = AUDIT_STATUS_COMPLETED

    this.auditSrv
      .upsertAudit(audit)
      .then(res => {
        this.presentSnackBar('Audit completed!')
      })
      .catch(err => {
        console.error(err)
        this.presentSnackBar('Can not audit complete!')
      })
  }

  onCloseEdition() {
    this.isEditState = false
    this.matEntpRef.options.forEach((data: MatOption) => data.deselect());
  }

  async onFileSelected({ $event, gitem }) {
    const file = $event.target.files[0]

    try {
      const upRes = await this.fileSrv.uploadFile(file)
      const fileItem = { name: upRes.ref.name, fullPath: upRes.ref.fullPath }

      gitem.files = gitem.files ? [...gitem.files, fileItem] : [fileItem]
      this.auditSrv.upsertAudit(this.auditCandidate)
      this.presentSnackBar('File attached!')
    } catch (err) {
      console.error(err)
      this.presentSnackBar('Can not upload file!')
    }
  }

  async onDeleteFile({ file, gitem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      await this.auditSrv.upsertAudit(this.auditCandidate)
      this.presentSnackBar('File deleted!')
    } catch (err) {
      console.error(err)
      this.presentSnackBar('Can not delete file!')
    }
  }

  onItemAuditorChange($event: any) {
    this.saveAudit()
  }

  viewData() {
    console.log(this.htmlData)
  }
}
