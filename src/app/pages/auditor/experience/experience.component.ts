import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Audit } from 'src/app/interfaces/audit';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  public auditList$: Observable<Audit[]>
  public selAudit: Audit = {} as Audit

  constructor(private readonly auditSrv: AuditService) {

  }

  ngOnInit(): void {
    this.auditList$ = this.auditSrv.getAuditsByAuditor('Q7VmUH28xDWttKWNjNqk')
  }

  viewAudit(audit: Audit) {
    this.selAudit = audit
  }
}
