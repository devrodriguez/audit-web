import { Component, OnInit } from '@angular/core';
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
  public newAuditor: Auditor = {} as Auditor
  public auditors$: Observable<Auditor[]>

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly auditorSrv: AuditorService
  ) { }

  ngOnInit(): void {
    this.loadAuditors()
  }

  addAuditor() {
    this.auditorSrv
      .createAuditor(this.newAuditor)
      .then(res => {
        this.presentSnackBar('Auditor created!')
        this.newAuditor = {} as Auditor
      })
      .catch(err => {
        this.presentSnackBar('Could not create auditor!')
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
