import { Component, ViewChild, EventEmitter, Output, Inject, OnInit, Input } from '@angular/core'
import { QuillEditorComponent, QuillModules } from 'ngx-quill'
import Quill from 'quill';
import { jsPDF } from 'jspdf'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { AuditService } from 'src/app/services/audit.service'
import { ItemReport } from 'src/app/interfaces/item-report'
import { sansSerif } from 'src/app/constants/fonts'

@Component({
  selector: 'app-rich-editor',
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss']
})
export class RichEditorComponent implements OnInit {
  public htmlData: string
  public isEditable: boolean
  public itemReport: ItemReport = {} as ItemReport
  public modules: QuillModules

  @ViewChild('editor') editor: QuillEditorComponent
  @Output() onUpdate = new EventEmitter()

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private readonly snack: MatSnackBar,
    private readonly auditSrv: AuditService
  ) {
    const alignClass = Quill.import('attributors/style/align');
    const backgroundClass = Quill.import('attributors/style/background');
    const colorClass = Quill.import('attributors/style/color');
    const directionClass = Quill.import('attributors/style/direction');
    const fontClass = Quill.import('attributors/style/font');
    const sizeClass = Quill.import('attributors/style/size')
    const FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = ['impact', 'courier', 'comic'];
    Quill.register(FontAttributor, true);
    Quill.register(alignClass, true)
    Quill.register(backgroundClass, true);
    Quill.register(colorClass, true);
    Quill.register(directionClass, true);
    Quill.register(fontClass, true);
    Quill.register(sizeClass, true);
  }

  ngOnInit(): void {
    const { itemReport, isEditable } = this.inputData
    this.itemReport = itemReport
    this.isEditable = isEditable
  }

  saveData() {    
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
      format: 'letter'
    });

    doc.html(content, {
      callback: (doc: jsPDF) => {
        doc.save('document.pdf');
      },
      margin: [35, 35, 35, 35],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 816,
      windowWidth: 816,
    });
  }

  presentSnack(message: string) {
    this.snack.open(message, undefined, {
      duration: 3000
    })
  }
}
