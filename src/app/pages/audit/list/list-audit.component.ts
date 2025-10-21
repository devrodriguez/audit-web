import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { Audit } from 'src/app/interfaces/audit';
import { ItemReport } from 'src/app/interfaces/item-report';
import { AuditService } from 'src/app/services/audit.service';

import { CkeditorComponent } from 'src/app/components/ckeditor/ckeditor.component';

@Component({
  selector: 'app-list-audit',
  templateUrl: './list-audit.component.html',
  styleUrls: ['./list-audit.component.scss']
})
export class ListAuditComponent implements OnInit {
  auditsList$: Observable<Audit[]>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly auditSrv: AuditService
  ) {

  }
  ngOnInit(): void {
    this.loadAudits()
  }

  loadAudits() {
    this.auditsList$ = this.auditSrv.getAudits()
  }

  previewReport(audit: Audit) {
    this.auditSrv.getAuditItemsReport(audit.id)
      .pipe(take(1))
      .subscribe({
        next: (items) => {
          let reportContent = items.map(item => `<p>${item.itemContent}</p>`).join('')

          const itemReport: ItemReport = {
            itemContent: reportContent
          }

          const dialogRef = this.matDialog.open(CkeditorComponent, {
            width: '100%',
            minHeight: 'calc(100vh - 90px)',
            height: '600px',
            data: {
              itemReport,
            }
          })
          dialogRef.afterClosed()
            .pipe(take(1))
            .subscribe(res => {
              console.log('dialog was closed')
            })
        },
        error: (err) => {
          console.error(err)
        }
      })
  }
}
