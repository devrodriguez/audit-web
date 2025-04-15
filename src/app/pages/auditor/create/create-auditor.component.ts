import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditorService } from 'src/app/services/auditor.service';

@Component({
  selector: 'app-auditor',
  templateUrl: './create-auditor.component.html',
  styleUrls: ['./create-auditor.component.scss']
})
export class AuditorComponent implements OnInit {
  @ViewChild('af') auditorFormDr: NgForm;
  @ViewChild(FormGroupDirective) myForm

  public newAuditor: Auditor = {} as Auditor
  public auditors$: Observable<Auditor[]>
  public auditorForm: FormGroup

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly auditorSrv: AuditorService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.auditorForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
    })

    this.loadAuditors()
  }

  auditorFormSubmit() {
    this.newAuditor = this.auditorForm.value

    this.auditorSrv
      .createAuditor(this.newAuditor)
      .then(res => {
        this.presentSnackBar('Auditor created!')
        this.auditorForm.reset()
        this.auditorFormDr.resetForm()
      })
      .catch(err => {
        this.presentSnackBar('Could not create auditor!')
        console.error(err)
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
