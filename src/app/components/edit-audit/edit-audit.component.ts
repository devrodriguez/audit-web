import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, take } from 'rxjs';

import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditFile } from 'src/app/interfaces/audit-file';
import { AuditItem } from 'src/app/interfaces/audit-item';
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
  @Input() isAuditorEnabled: boolean = true
  @Input() isAuditorShow: boolean = true
  @Input() isFileEnabled: boolean = true
  @Input() isEditorEnabled: boolean = true
  @Input() isTitleEnabled: boolean = true
  @Input() additionalItems: AuditItem[] = []
  
  @Output() onFileSelected = new EventEmitter()
  @Output() onDeleteFile = new EventEmitter()
  @Output() onItemAuditorChange = new EventEmitter<{ event: any, index: number }>()
  @Output() onAddNewItem = new EventEmitter<{event: any, error: Error}>()

  auditForm: FormGroup;
  auditAddForm: FormGroup;

  destroyer$: Subject<void> = new Subject()

  constructor(
    private fb: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly auditSrv: AuditService,
    private readonly fileSrv: FileService,
  ) { }

  ngOnInit(): void {
    this.auditForm = this.fb.group({
      auditItems: this.fb.array(this.audit.auditItems.map(item => this.createGoalItemFormGroup(item)))
    });
  }

  ngOnDestroy(): void {
    this.destroyer$.next()
    this.destroyer$.complete()
  }

  get auditItemsFormArr(): FormArray {
    return this.auditForm.get('auditItems') as FormArray;
  }

  createGoalItemFormGroup(item: AuditItem): FormGroup {
    return this.fb.group({
      auditor: [item.auditor || null, Validators.required]
    });
  }

  compareAuditor(x: Auditor, y: Auditor): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  fileSelected($event: any, auditItem: AuditItem) {
    if(!this.isFileEnabled) return

    this.onFileSelected.emit({ $event, auditItem })
  }

  deleteFile(file: AuditFile, auditItem: AuditItem) {
    if(!this.isFileEnabled) return

    this.onDeleteFile.emit({ file, auditItem })
  }

  itemAuditorChange(event: any, index: number) {
    if(!this.isAuditorEnabled) return

    const selectedAuditor = event.value
    this.auditItemsFormArr.at(index).get('auditor').setValue(selectedAuditor)
    this.onItemAuditorChange.emit({ event, index })
  }

  onShowEditor(auditItem: AuditItem) {
    this.auditSrv.getItemReport(this.audit.id, auditItem.id)
      .pipe(
        take(1)
      ).subscribe({
        next: (itemReports) => {
          let itemReport: ItemReport = {
            auditID: this.audit.id,
            goalItemID: auditItem.id
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

  addNewItem(event: any, item: AuditItem) {
    const exists = this.audit.auditItems.some(auditItem => auditItem.id === item.id);
    if (exists) {
      this.onAddNewItem.emit({ event, error: new Error('Item already exists') });
      return;
    }

    this.audit.auditItems.push(item)

    this.auditSrv.upsertAudit(this.audit)
    .then(() => {
      const formGroup = this.createGoalItemFormGroup(item);
      this.auditItemsFormArr.push(formGroup);

      const index = this.additionalItems.findIndex(addItem => addItem.id === item.id);
      if (index !== -1) {
        this.additionalItems.splice(index, 1);
      }

      this.onAddNewItem.emit({ event, error: null });
    })
    .catch(error => {
      console.error(error);
      this.onAddNewItem.emit({ event, error });
    })
  }
}
