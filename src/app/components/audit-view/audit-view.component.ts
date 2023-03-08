import { Component, Input } from '@angular/core';
import { Audit } from 'src/app/interfaces/audit';
import { Finding } from 'src/app/interfaces/finding';

@Component({
  selector: 'app-audit-view',
  templateUrl: './audit-view.component.html',
  styleUrls: ['./audit-view.component.scss']
})
export class AuditViewComponent {
  @Input() audit: Audit = {} as Audit

  newFinding: Finding = {} as Finding;
  newFindings: Finding[] = []

  addFinding() {
    this.newFinding.codeIdx = new Date().getTime()
    this.newFindings.push(this.newFinding)
    this.newFinding = {} as Finding
  }

  removeFinding(finding: Finding) {
    this.newFindings = this.newFindings.filter(f => {
      return f.codeIdx !== finding.codeIdx
    })
  }
}
