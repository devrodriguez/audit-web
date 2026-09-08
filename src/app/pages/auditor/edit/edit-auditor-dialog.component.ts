import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Auditor } from 'src/app/interfaces/auditor';
import { AuditorService } from 'src/app/services/auditor.service';

export interface EditAuditorDialogData {
  auditor?: Auditor;
}

@Component({
  selector: 'app-edit-auditor-dialog',
  templateUrl: './edit-auditor-dialog.component.html',
  styleUrls: ['./edit-auditor-dialog.component.scss']
})
export class EditAuditorDialogComponent implements OnInit {
  editForm: FormGroup;
  saving: boolean = false;
  saveError: string = null;

  private static readonly EMAIL_PATTERN = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

  constructor(
    private readonly fb: FormBuilder,
    private readonly auditorSrv: AuditorService,
    private readonly dialogRef: MatDialogRef<EditAuditorDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: EditAuditorDialogData
  ) { }

  get isEditMode(): boolean {
    return !!this.data.auditor;
  }

  ngOnInit(): void {
    const auditor = this.data.auditor || {} as Auditor;
    this.editForm = this.fb.group({
      name: [auditor.name || '', [Validators.required]],
      lastName: [auditor.lastName || '', [Validators.required]],
      email: this.isEditMode
        ? [{ value: auditor.email, disabled: true }]
        : ['', [Validators.required, Validators.pattern(EditAuditorDialogComponent.EMAIL_PATTERN)]]
    });
  }

  save(): void {
    if (this.editForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.saveError = null;

    const { name, lastName, email } = this.editForm.getRawValue();
    const request = this.isEditMode
      ? this.auditorSrv.updateAuditor(this.data.auditor.id, { name, lastName })
      : this.auditorSrv.createAuditor({
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim()
        });

    request
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        console.error(err);
        this.saving = false;
        this.saveError = err?.code === 'permission-denied'
          ? 'Sin permisos para guardar. Revise las reglas de Firestore.'
          : 'No se pudo guardar. Intente de nuevo.';
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
