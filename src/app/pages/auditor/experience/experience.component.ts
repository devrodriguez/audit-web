import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  public auditList: Audit[]
  public auditorList$: Observable<Auditor[]>
  public selAudit: Audit = {} as Audit

  constructor(
    private readonly auditSrv: AuditService,
    private readonly auditorSrv: AuditorService
  ) {}

  ngOnInit() {
    this.getAudits()
    this.getAuditors()
  }
  
  getAudits() {
    this.auditSrv.getAudits()
    .subscribe(res => {
      this.auditList = res.filter(item => item.goalItems.find(gi => gi.auditor && gi.auditor.id === 'Q7VmUH28xDWttKWNjNqk'))
    }, err => {
      console.error(err)
    })
  }

  getAuditors() {
    this.auditorList$ = this.auditorSrv.getAuditors()
  }

  viewAudit(audit: Audit) {
    this.selAudit = audit
  }

  /** Events */
  closeEdition() {
    this.selAudit = {} as Audit
  }
}
