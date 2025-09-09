import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { AuditService } from 'src/app/services/audit.service';
import { Audit } from 'src/app/interfaces/audit';
import { AUDIT_STATUS_COMPLETED, AUDIT_STATUS_PENDING } from 'src/app/constants/audit-status';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  pendingCount = 0;
  completedLast30Count = 0;
  pendingAudits: Audit[] = [];

  doughnutChartLabels: string[] = ['Pending', 'Completed (30d)'];
  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#7E57C2', '#EC407A'],
        hoverBackgroundColor: ['#673AB7', '#D81B60']
      }
    ]
  };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor(private readonly auditSrv: AuditService) {}

  ngOnInit(): void {
    const sub = this.auditSrv.getAudits().subscribe({
      next: (audits) => this.computeKpis(audits),
      error: (err) => console.error(err)
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private computeKpis(audits: Audit[]) {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const since = now - THIRTY_DAYS;

    this.pendingAudits = audits
      .filter(a => (a.status || '').toLowerCase() === AUDIT_STATUS_PENDING)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    this.pendingCount = this.pendingAudits.length;

    this.completedLast30Count = audits.filter(a => {
      const isCompleted = (a.status || '').toLowerCase() === AUDIT_STATUS_COMPLETED;
      const completedAtMs = typeof a.completedAt === 'number' ? a.completedAt : 0;
      return isCompleted && completedAtMs >= since && completedAtMs <= now;
    }).length;

    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: [this.pendingCount, this.completedLast30Count]
        }
      ]
    };
  }
}
