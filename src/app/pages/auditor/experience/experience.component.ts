import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemReport } from 'src/app/interfaces/item-report';
import { FileService } from 'src/app/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CkeditorComponent } from 'src/app/components/ckeditor/ckeditor.component';
import { AuthService } from 'src/app/services/auth.service';

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
    private readonly authSrv: AuthService,
    private readonly fileSrv: FileService
  ) { }

  ngOnInit() {
    this.loadAudits()
    this.loadAuditors()
  }

  loadAudits() {
    const userData = this.authSrv.userData
    this.auditSrv.getAudits()
      .subscribe(res => {
        //this.auditList = res
        this.auditList = res.filter(item => {
          console.log('Item: ', item)
          return item.goalItems.find(gi => gi.auditor && gi.auditor.email === userData.email)
        })
        console.log(this.auditList)
        console.log('User data: ', userData)
      }, err => {
        console.error(err)
      })
  }

  loadAuditors() {
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
      this.auditSrv.upsertAudit(this.selectedAudit)
      this.presentSnackBar('File saved!')
    } catch (err) {
      this.presentSnackBar('Could not save file!')
      console.error(err)
    }
  }

  async onDeleteFile({ file, gitem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = gitem.files.findIndex(item => item.name == file.name)
      gitem.files.splice(fileIdx, 1)
      await this.auditSrv.upsertAudit(this.selectedAudit)
      this.presentSnackBar('File deleted!')
    } catch (err) {
      this.presentSnackBar('Could not delete file!')
      console.error(err)
    }
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

        const dialogRef = this.matDialog.open(CkeditorComponent, {
          height: '900px',
          data: {
            itemReport,
            isEditable: false
          }
        })
        dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe(res => {
          console.log('Dialog was closed')
        })
      })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
