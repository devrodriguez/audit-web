import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { QuillEditorComponent } from 'ngx-quill';
import { Observable, take } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { GoalFile } from 'src/app/interfaces/goal-file';
import { GoalItem } from 'src/app/interfaces/goal-item';
import { ItemReport } from 'src/app/interfaces/item-report';
import { AuditService } from 'src/app/services/audit.service';
import { CkeditorComponent } from '../ckeditor/ckeditor.component';
import { RichEditorComponent } from '../rich-editor/rich-editor.component';

@Component({
  selector: 'app-edit-audit',
  templateUrl: './edit-audit.component.html',
  styleUrls: ['./edit-audit.component.scss']
})
export class EditAuditComponent {
  @Input() audit: Audit
  @Input() auditorsList$: Observable<Auditor[]>
  @Input() isAuditorDisabled: boolean
  @Output() onFileSelected = new EventEmitter()
  @Output() onDeleteFile = new EventEmitter()
  @Output() onItemAuditorChange = new EventEmitter()

  @ViewChild('editor') editor: QuillEditorComponent;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly auditSrv: AuditService) {}

  loadItemReport(auditID: string, goalItemID: string) {
    this.auditSrv.getItemReport(auditID, goalItemID)
    .pipe(
      take(1)
    ).subscribe(itemReports => {
      let itemReport: ItemReport = {
        auditID,
        goalItemID
      } as ItemReport

      if(itemReports.length) {
        itemReport = itemReports[0]
      }

      this.matDialog.open(CkeditorComponent, {
        width: '100%',
        minHeight: 'calc(100vh - 90px)',
        height : 'auto',
        data: {
          itemReport,
          isEditable: true
        }
      })
    }, err => {
      console.error(err)
    })
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  fileSelected($event: any, gitem: GoalItem) {
    this.onFileSelected.emit({$event, gitem})
  }

  deleteFile(file: GoalFile, gitem: GoalItem) {
    this.onDeleteFile.emit({file, gitem})
  }

  itemAuditorChange(evt) {
    this.onItemAuditorChange.emit(evt)
  }

  exportPDF() {
    const content = this.editor.quillEditor.root.innerHTML;
    const doc = new jsPDF();
    doc.html(content, {
      callback: (doc: jsPDF) => {
        doc.save('document.pdf');
      }
    });
  }

  showEditor(goalItem: GoalItem) {
    this.loadItemReport(this.audit.id, goalItem.id)
  }
}
