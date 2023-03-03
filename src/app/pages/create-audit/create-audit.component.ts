import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Audit } from 'src/app/interfaces/audit';
import { Auditor } from 'src/app/interfaces/auditor';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { Goal } from 'src/app/interfaces/goal';
import { AuditService } from 'src/app/services/audit.service';
import { AuditorService } from 'src/app/services/auditor.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GoalsService } from 'src/app/services/goals.service';

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.scss']
})
export class CreateAuditComponent implements OnInit {
  public auditors: Auditor[] = []
  public enterprises: Enterprise[] = []
  public audit: Audit
  public goals: Goal[] = []
  public auditGoals: Goal[] = []
  public $filteredGoals: Observable<Goal[]>
  public selectedGoals: Goal[] = []
  public selectedAuditor: Auditor = {} as Auditor
  public selectedEnterp: Enterprise = {} as Enterprise

  goalsAutoCtl = new FormControl('')

  constructor(
    private matSnackBar: MatSnackBar,
    private auditSrv: AuditService,
    private auditorSrv: AuditorService,
    private enterpriseSrv: EnterpriseService,
    private goalSrv: GoalsService) { }

  ngOnInit(): void {
    this.getAuditors()
    this.getEnterprises()
    this.getGoals()
  }

  getAuditors() {
    this.auditorSrv
    .getAuditors()
    .subscribe(res => {
      this.auditors = res
    }, err => {
      console.error(err)
    })
  }

  getEnterprises() {
    this.enterpriseSrv
    .getEnterprises()
    .subscribe(res => {
      this.enterprises = res
    }, err => {
      console.error(err)
    })
  }

  getGoals() {
    this.goalSrv
    .getGoals()
    .subscribe(res => {
      this.goals = res

      this.$filteredGoals = this.goalsAutoCtl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
    }, err => {
      console.error(err)
    })
  }

  createAudit() {
    let newAudit = {
      auditor: this.selectedAuditor,
      enterprise: this.selectedEnterp,
      goals: this.auditGoals
    } as Audit

    this.auditSrv.createAudit(newAudit).then(res => {
      this.presentSnackBar('Auditoria creada correctamente')
    })
    .catch(err => {
      console.error(err);
      this.presentSnackBar('Error al crear auditoria')
    })

  }

  /** Functions */
  private _filter(value: string): Goal[] {
    const filterValue = value.toLowerCase();

    return this.goals.filter(goal => goal.name.toLowerCase().includes(filterValue));
  }

  displayGoalName(goal: Goal) {
      return goal && goal.name ? goal.name : '';
  }

  /** Events */
  selectGoal(evt: MatAutocompleteSelectedEvent) {
    const selGoal = evt.option.value as Goal;

    if (this.auditGoals.find(item => item.id == selGoal.id)) return
    this.selectedGoals.unshift(selGoal);
    this.auditGoals.unshift({
      id: selGoal.id,
      name: selGoal.name
    } as Goal);
  }

  /** Event Components */
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
