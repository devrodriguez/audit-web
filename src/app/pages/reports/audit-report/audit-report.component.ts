import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import { Audit } from 'src/app/interfaces/audit';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss'],
})
export class AuditReportComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['enterprise', 'type', 'status', 'audited_by', 'created_at', 'completed_at']
  auditDataSource: MatTableDataSource<Audit> = new MatTableDataSource([] as Audit[])

  @ViewChild(MatSort) sort: MatSort

  constructor(private readonly auditSrv: AuditService) {
    
  }

  ngAfterViewInit(): void {
    this.loadAudits()
  }

  ngOnInit(): void {

  }

  loadAudits() {
    this.auditSrv.getAudits()
    .subscribe({
      next: (audits) => {
        this.auditDataSource = new MatTableDataSource(audits)
        this.auditDataSource.filterPredicate = (data: Audit, filter: string) => {
          
          if(
            data.status.trim().toLowerCase().indexOf(filter) >= 0 ||
            data.enterprise.name.trim().toLowerCase().indexOf(filter) >= 0 ||
            data.auditType.name.trim().toLowerCase().indexOf(filter) >= 0 ||
            data.goalItems.find(gi => gi.auditor && gi.auditor.name.trim().toLowerCase().indexOf(filter) >= 0 )
            ) return true
    
          return false
        }
        this.auditDataSource.sort = this.sort
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim()
    filterValue = filterValue.toLowerCase()
    this.auditDataSource.filter = filterValue
  }

  normalizeAuditors(audit: Audit): string[] {
    let auditorNames: string[] = []

    auditorNames = audit.goalItems
    .map(gi => {
      if (gi.auditor) {
        return `${gi.auditor.name} ${gi.auditor.lastName}`
      }
    })
    .filter(auditorName => auditorName)

    return Array.from(new Set(auditorNames))
  }
}
