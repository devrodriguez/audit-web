import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { ItemReport } from 'src/app/interfaces/item-report';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
  public itemReport: ItemReport = {} as ItemReport
  public isEditable: boolean
  public ckEditorConfig = {
    licenseKey: 'kEdRQrbtzMN9TgGX/tPgpl/Qetea7NpJGllnVH76rkuBOzB7xwmVZCQNpm8=',
    exportPdf: {
      converterOptions: {
        format: 'Letter',
        margin_top: '19mm',
        margin_bottom: '19mm',
        margin_right: '19mm',
        margin_left: '19mm',
        page_orientation: 'portrait'
      },
    }
  }
  public Editor = Editor;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private readonly snack: MatSnackBar,
    private readonly auditSrv: AuditService
  ) {
    console.log(inputData)
  }

  ngOnInit(): void {
    const { itemReport, isEditable } = this.inputData
    this.itemReport = itemReport
    this.isEditable = isEditable
  }

  public onReady(editor: any): void {
    const decoupledEditor = editor;
    const element = decoupledEditor.ui.getEditableElement()!;
    const parent = element.parentElement!;

    parent.insertBefore(
      decoupledEditor.ui.view.toolbar.element!,
      element
    );
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

  presentSnack(message: string) {
    this.snack.open(message, undefined, {
      duration: 3000
    })
  }
}