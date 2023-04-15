import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { QuillEditorComponent } from 'ngx-quill';
import { Observable } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { GoalFile } from 'src/app/interfaces/goal-file';
import { GoalItem } from 'src/app/interfaces/goal-item';
import { EditorComponent } from '../editor/editor.component';

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

  constructor(private readonly matDialog: MatDialog) {

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
    this.matDialog.open(EditorComponent, {
      data: {
        auditID: this.audit.id,
        goalItemID: goalItem.id
      }
    })
  }
}
