import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { jsPDF } from "jspdf";

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
  public htmlData: string
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
  @ViewChild('editor') editor: QuillEditorComponent;

  // public filteredGoalItems$: Observable<GoalItem[]>
  public auditorsList$: Observable<Auditor[]>
  public enterprisesList$: Observable<Enterprise[]>
  public auditsList$: Observable<Audit[]>;
  goalsAutoCtl = new FormControl('')

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
    this.getAccounts()
    this.loadAudits()
  }

  getAccounts() {
    this.goalSrv.getGoalItemsByType(TYPE_ACCOUNT).subscribe(gi => {
      this.goalItems = gi
    })
  }

  initializeAudit() {
    if (!this.newAudit?.enterprise?.id) {
      this.presentSnackBar('Enterprise is required!')
      return
    }

    if (this.audits.find(audit => audit.enterprise.id == this.newAudit.enterprise.id && audit.status === AUDIT_STATUS_PENDING)) {
      this.presentSnackBar(`Audit for enterprise ${this.newAudit.enterprise.name} already exist!`)
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

  completeAudit(audit: Audit) {
    if (!confirm(`Estas seguro de completar la auditoría ${audit?.enterprise?.name}`)) return

    audit.status = 'completed'

    this.auditSrv
      .upsertAudit(audit)
      .then(res => {
        this.presentSnackBar('Audit completed!')
      })
      .catch(err => {
        console.error(err)
      })
  }

  saveAudit() {
    this.auditSrv
      .upsertAudit(this.newAudit)
      .then(res => {
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

  async onFileSelected({ $event, gitem }) {
    const file = $event.target.files[0]

    try {
      const upRes = await this.fileSrv.uploadFile(file)
      const fileItem = { name: upRes.ref.name, fullPath: upRes.ref.fullPath }
      gitem.files = gitem.files ? [...gitem.files, fileItem] : [fileItem]
      this.auditSrv.upsertAudit(this.newAudit)
    } catch (err) {
      console.error(err)
    }
  }

  async onDeleteFile({ file, gitem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      await this.auditSrv.upsertAudit(this.newAudit)
      this.presentSnackBar('File deleted!')
    } catch (err) {
      this.presentSnackBar('Could not delete file!')
      console.error(err)
    }

    /* this.fileSrv.deleteFile(file)
    .then(res => {
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      this.presentSnackBar('File deleted!')
    })
    .catch(err => {
      this.presentSnackBar('Could not delete file!')
      console.error(err)
    }) */
  }

  onItemAuditorChange($event: any) {
    this.saveAudit()
  }

  exportPDF() {
    const content = this.editor.quillEditor.root.innerHTML;
    console.log(content)
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4'
    });

    doc.html(content, {
      callback: (doc: jsPDF) => {
        doc.save('document.pdf');
      },
      margin: [20, 20, 20, 20],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 675
    });
  }

  viewData() {
    console.log(this.htmlData)
  }
}
