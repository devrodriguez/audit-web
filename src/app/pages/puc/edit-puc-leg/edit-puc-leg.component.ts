import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Goal } from 'src/app/interfaces/goal';
import { GoalItem, ItemType } from 'src/app/interfaces/goal-item';
import { GoalsService } from 'src/app/services/goals.service';

@Component({
  selector: 'app-edit-puc-leg',
  templateUrl: './edit-puc-leg.component.html',
  styleUrls: ['./edit-puc-leg.component.scss']
})
export class EditPucLegComponent implements OnInit {
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

  goalItems: GoalItem[] = []
  newGoalItem: GoalItem = {} as GoalItem

  constructor(
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private readonly goalsSrv: GoalsService) {}

  ngOnInit(): void {
    this.getGoalItems()
  }

  onTypeChange(evt) {
    this.newGoalItem.type = evt.value
  }

  getGoalItems() {
    this.goalsSrv.getGoalItems().subscribe(items => {
      this.goalItems = items
    }, err => {
      console.error(err)
    })
  }

  createItem() {
    let alreadyExist = this.goalItems.find(item => item.code === this.newGoalItem.code) 
    if (alreadyExist) {
      this.presentSnackBar('Item already exist!')
      return
    }

    this.goalsSrv.addGoalItem(this.newGoalItem).then(res => {
      this.newGoalItem.code = ''
      this.newGoalItem.name = ''
      this.presentSnackBar('Item created')
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
}
