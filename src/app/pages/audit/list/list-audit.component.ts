import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Audit } from 'src/app/interfaces/audit';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-list-audit',
  templateUrl: './list-audit.component.html',
  styleUrls: ['./list-audit.component.scss']
})
export class ListAuditComponent implements OnInit {
  auditsList$: Observable<Audit[]>;

  constructor(
    private readonly auditSrv: AuditService
  ) {

  }
  ngOnInit(): void {
    this.loadAudits()
  }

  loadAudits() {
    this.auditsList$ = this.auditSrv.getAudits()
    this.auditSrv.getAudits().subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
}
