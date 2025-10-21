import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { AuditItemFile } from 'src/app/interfaces/audit-item';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {
  public auditList: Audit[] = []
  public auditorList$: Observable<Auditor[]>
  public selectedAudit: Audit = {} as Audit

  destroyer$: Subject<void> = new Subject()

  private readonly MAX_FILE_SIZE_MB = 10;

  constructor(
    private readonly auditSrv: AuditService,
    private readonly auditorSrv: AuditorService,
    private readonly authSrv: AuthService,
    private readonly fileSrv: FileService,
    private notifySrv: NotificationService,
  ) { }

  ngOnInit() {
    this.loadAudits()
    this.loadAuditors()
  }

  ngOnDestroy() {
    this.destroyer$.next()
    this.destroyer$.complete()
  }

  get isAuditCompleted() {
    return this.selectedAudit.status === 'completed'
  }

  loadAudits() {
    const userData = this.authSrv.userData
    this.auditSrv.getAudits()
      .pipe(takeUntil(this.destroyer$))
      .subscribe({
        next: (res) => {
          this.auditList = res.filter(item => item.auditItems.find(gi => gi.auditor && gi.auditor.email === userData.email))
          this.auditList.forEach((audit) => {
            audit.auditItems = audit.auditItems.filter(gi => gi.auditor && gi.auditor.email === userData.email)
          })
        },
        error: (err) => {
          console.error(err)
        }
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

  async onFileSelected({ $event, auditItem }) {
    const file = $event.target.files[0]

    if (!file) {
      return;
    }

    if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
      this.notifySrv.showWarning(`El tamaño del archivo no debe ser mayor a ${this.MAX_FILE_SIZE_MB}MB`)
      return
    }

    if (auditItem.files && auditItem.files.some((f: AuditItemFile) => f.name === file.name)) {
      this.notifySrv.showWarning('El archivo ya existe en este ítem de auditoría.')
      return
    }

    try {
      const upRes = await this.fileSrv.uploadFile(file)
      const fileItem = { 
        name: upRes.ref.name, 
        fullPath: upRes.ref.fullPath,
      } as AuditItemFile

      auditItem.files = [...(auditItem.files || []), fileItem]
      await this.auditSrv.upsertAudit(this.selectedAudit)
      this.notifySrv.showSuccess('El archivo fue cargado correctamente.')
    } catch (err) {
      console.error(err)
      this.notifySrv.showError('No se pudo cargar el archivo')
    }
  }

  async onDeleteFile({ file, auditItem }) {
    try {
      await this.fileSrv.deleteFile(file)
      const fileIdx = auditItem.files.findIndex(item => item.name == file.name)
      auditItem.files.splice(fileIdx, 1)
      await this.auditSrv.upsertAudit(this.selectedAudit)

      this.notifySrv.showSuccess('El archivo ha sido eliminado')
    } catch (err) {
      this.notifySrv.showError('No fue posible eliminar el archivo')
      console.error(err)
    }
  }
}
