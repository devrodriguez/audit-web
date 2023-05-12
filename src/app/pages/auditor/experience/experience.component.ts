import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { jsPDF } from 'jspdf'

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { MatDialog } from '@angular/material/dialog';
import { RichEditorComponent } from 'src/app/components/rich-editor/rich-editor.component';
import { ItemReport } from 'src/app/interfaces/item-report';
import { FileService } from 'src/app/services/file.service';
import { UploadResult } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  public auditList: Audit[]
  public auditorList$: Observable<Auditor[]>
  public selectedAudit: Audit = {} as Audit

  constructor(
    private readonly matDialog: MatDialog,
    private readonly matSnackBar: MatSnackBar,
    private readonly auditSrv: AuditService,
    private readonly auditorSrv: AuditorService,
    private readonly fileSrv: FileService
  ) { }

  ngOnInit() {
    this.getAudits()
    this.getAuditors()
  }

  getAudits() {
    this.auditSrv.getAudits()
      .subscribe(res => {
        this.auditList = res.filter(item => item.goalItems.find(gi => gi.auditor && gi.auditor.id === 'Q7VmUH28xDWttKWNjNqk'))
      }, err => {
        console.error(err)
      })
  }

  getAuditors() {
    this.auditorList$ = this.auditorSrv.getAuditors()
  }

  viewAudit(audit: Audit) {
    this.selectedAudit = audit
  }

  /** Events */
  closeEdition() {
    this.selectedAudit = {} as Audit
  }

  async onFileSelected({ $event, gitem }) {
    const file = $event.target.files[0]

    try {
      const upRes = await this.fileSrv.uploadFile(file)
      const fileItem = { name: upRes.ref.name, fullPath: upRes.ref.fullPath }
      gitem.files = gitem.files ? [...gitem.files, fileItem] : [fileItem]
      this.auditSrv.updateAudit(this.selectedAudit)
    } catch (err) {
      console.error(err)
    }
  }

  async onDeleteFile({ file, gitem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      await this.auditSrv.updateAudit(this.selectedAudit)
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

  previewReport() {
    this.auditSrv.getAuditItemsReport(this.selectedAudit.id)
      .subscribe(items => {
        let reportContent = ''

        items.forEach(item => {
          reportContent += `<p>${item.itemContent}</p>`
        })

        console.log('report content: ', reportContent)
        const itemReport: ItemReport = {
          itemContent: reportContent
        }

        this.matDialog.open(RichEditorComponent, {
          data: {
            itemReport,
            isEditable: false
          }
        })
      })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
