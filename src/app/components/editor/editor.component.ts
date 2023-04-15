import { Component, ViewChild, EventEmitter, Output, Inject, OnInit } from '@angular/core'
import { QuillEditorComponent } from 'ngx-quill'
import { jsPDF } from 'jspdf'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AuditService } from 'src/app/services/audit.service'
import { ItemReport } from 'src/app/interfaces/item-report'
import { take } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  public htmlData: string
  public isViewMode: boolean
  public itemReport: ItemReport = {} as ItemReport

  @ViewChild('editor') editor: QuillEditorComponent
  @Output() onUpdate = new EventEmitter()

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private readonly snack: MatSnackBar,
    private readonly auditSrv: AuditService
  ) {
    
  }

  ngOnInit(): void {
    this.loadItemReport()
  }

  async loadItemReport() {
    await this.auditSrv.getItemReport(this.inputData.auditID, this.inputData.goalItemID)
    .pipe(
      take(1)
    ).subscribe(data => {
      if(data.length) {
        this.itemReport = data[0]
      }
    })
  }

  saveData() {
    this.itemReport.auditID = this.inputData.auditID
    this.itemReport.goalItemID = this.inputData.goalItemID
    
    this.auditSrv.updateItemReport(this.itemReport)
    .then(() => {
      this.presentSnack('Data updated!')
    })
    .catch(err => {
      console.error(err)
      this.presentSnack('Error updating data!')
    })
  }

  exportPDF() {
    const content = this.itemReport.itemContent;

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

  presentSnack(message: string) {
    this.snack.open(message, undefined, {
      duration: 3000
    })
  }
}
