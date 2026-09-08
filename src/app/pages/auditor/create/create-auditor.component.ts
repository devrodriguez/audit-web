import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditorService } from 'src/app/services/auditor.service';
import { EditAuditorDialogComponent } from '../edit/edit-auditor-dialog.component';

@Component({
  selector: 'app-auditor',
  templateUrl: './create-auditor.component.html',
  styleUrls: ['./create-auditor.component.scss']
})
export class AuditorComponent implements OnInit {
  public auditors$: Observable<Auditor[]>

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly matDialog: MatDialog,
    private readonly auditorSrv: AuditorService
  ) { }

  ngOnInit(): void {
    this.loadAuditors()
  }

  createAuditor() {
    this.matDialog.open(EditAuditorDialogComponent, {
      width: '480px',
      data: {}
    })
    .afterClosed()
    .subscribe(saved => {
      if (saved) {
        this.presentSnackBar('Auditor created!')
      }
    })
  }

  deleteAuditor(auditor: Auditor) {
    this.auditorSrv
    .removeAuditor(auditor.id)
    .then(res => {
      this.presentSnackBar('Auditor deleted!')
    })
    .catch(err => {
      console.error(err)
    })
  }

  editAuditor(auditor: Auditor) {
    this.matDialog.open(EditAuditorDialogComponent, {
      width: '480px',
      data: { auditor }
    })
    .afterClosed()
    .subscribe(saved => {
      if (saved) {
        this.presentSnackBar('Auditor updated!')
      }
    })
  }

  loadAuditors() {
    this.auditors$ = this.auditorSrv.getAuditors()
  }

  /** Event Components */
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
