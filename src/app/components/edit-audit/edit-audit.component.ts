import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { QuillEditorComponent } from 'ngx-quill';
import { Observable, take } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { GoalFile } from 'src/app/interfaces/goal-file';
import { AuditItemType } from 'src/app/interfaces/goal-item';
import { ItemReport } from 'src/app/interfaces/item-report';
import { AuditService } from 'src/app/services/audit.service';
import { CkeditorComponent } from '../ckeditor/ckeditor.component';
import { FileService } from 'src/app/services/file.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-audit',
  templateUrl: './edit-audit.component.html',
  styleUrls: ['./edit-audit.component.scss']
})
export class EditAuditComponent implements OnInit {
  @Input() audit: Audit
  @Input() auditorsList$: Observable<Auditor[]>
  @Input() isAuditorDisabled: boolean
  @Input() isFileDisabled: boolean
  @Input() isEditorDisabled: boolean
  @Input() isTitleDisabled: boolean
  
  @Output() onFileSelected = new EventEmitter()
  @Output() onDeleteFile = new EventEmitter()
  @Output() onItemAuditorChange = new EventEmitter<{ event: any, index: number }>()

  @ViewChild('editor') editor: QuillEditorComponent;

  auditForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly auditSrv: AuditService,
    private readonly fileSrv: FileService) { }

  ngOnInit(): void {
    this.auditForm = this.fb.group({
      goalItems: this.fb.array(this.audit.goalItems.map(item => this.createGoalItemFormGroup(item)))
    });
  }

  get goalItems(): FormArray {
    return this.auditForm.get('goalItems') as FormArray;
  }

  createGoalItemFormGroup(item: AuditItemType): FormGroup {
    return this.fb.group({
      auditor: [item.auditor || null, Validators.required]
    });
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  fileSelected($event: any, gitem: AuditItemType) {
    if(this.isFileDisabled) return

    this.onFileSelected.emit({ $event, gitem })
  }

  deleteFile(file: GoalFile, gitem: AuditItemType) {
    if(this.isFileDisabled) return

    this.onDeleteFile.emit({ file, gitem })
  }

  itemAuditorChange(event: any, index: number) {
    if(this.isAuditorDisabled) return

    const selectedAuditor = event.value
    this.goalItems.at(index).get('auditor').setValue(selectedAuditor)
    this.onItemAuditorChange.emit({ event, index })
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

  onShowEditor(goalItem: AuditItemType) {
    this.auditSrv.getItemReport(this.audit.id, goalItem.id)
      .pipe(
        take(1)
      ).subscribe({
        next: (itemReports) => {
          let itemReport: ItemReport = {
            auditID: this.audit.id,
            goalItemID: goalItem.id
          } as ItemReport
  
          if (itemReports.length) {
            itemReport = itemReports[0]
          }
  
          this.matDialog.open(CkeditorComponent, {
            width: '100%',
            minHeight: 'calc(100vh - 90px)',
            height: '600px',
            data: {
              itemReport,
              isEditable: true
            },
          })
        },
        error: (err) => {
          console.error(err)
        }
      })
  }

  onDownloadFile($event: any, file: any) {
    $event.preventDefault()
    this.fileSrv.getDownloadURL(file.fullPath)
    .then(url => {
      let linkFile = document.createElement('a')
      linkFile.setAttribute('type', 'hidden')
      linkFile.setAttribute('target', '_blank')
      linkFile.href = url
      linkFile.download = file.name
      document.body.appendChild(linkFile)
      linkFile.click()
      document.body.removeChild(linkFile)
    })
    .catch(err => {
      console.error(err)
    })
  } 
}
