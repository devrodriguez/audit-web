import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditItem, AuditItemType, ItemType } from 'src/app/interfaces/goal-item';
import { GoalsService } from 'src/app/services/goals.service';

@Component({
  selector: 'app-edit-puc-leg',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  @ViewChild('itemsFrm') itemsForm!: NgForm;

  public itemFormGrp: FormGroup
  types: ItemType[] = [
    {
      name: 'class',
      codeSize: 1
    },
    {
      name: 'group',
      codeSize: 2
    },
    {
      name: 'account',
      codeSize: 4
    },
    {
      name: 'sub account',
      codeSize: 6
    }
  ]

  auditItemTypes: AuditItemType[] = []

  auditItems: AuditItem[] = []

  constructor(
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private readonly goalsSrv: GoalsService,
    private readonly itemsFormBldr: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loadAuditItemTypes()
    this.loadAuditItems()

    this.itemFormGrp = this.itemsFormBldr.group({
      auditType: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    })
  }

  loadAuditItemTypes() {
    this.goalsSrv
    .getAuditItemTypes()
    .subscribe({
      next: (itemTypes) => {
        this.auditItemTypes = itemTypes
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  loadAuditItems() {
    this.goalsSrv
    .getAuditItems()
    .subscribe({
      next: (items) => {
        this.auditItems = items
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  onSubmitForm() {
    const {
      auditType,
      name,
      description,
    } = this.itemFormGrp.value

    const alreadyExist = this.auditItems.find(item => item.name === name)
    if (alreadyExist) {
      this.presentSnackBar('Item already exist!')
      return
    }

    const newAuditItem: AuditItem = {
      type: auditType,
      name,
      description,
    }

    this.goalsSrv.addGoalItem(newAuditItem)
      .then(res => {
        this.presentSnackBar('Item created')
        this.itemFormGrp.reset()
        this.itemsForm.resetForm()
      })
      .catch(err => {
        console.error(err)
      })
  }

  /** Event Components */
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }

  compareAuditType(auditType: AuditItemType, selectedAuditType: AuditItemType) {
    return auditType.name.toLowerCase() === 'contable'
    // return auditType && selectedAuditType && auditType.id === selectedAuditType.id
  }
}
