import { NgModule } from "@angular/core";

import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
    imports: [
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatChipsModule,
        MatExpansionModule,
        MatDividerModule,
        MatListModule,
        MatTreeModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatStepperModule,
    ],
    exports: [
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatChipsModule,
        MatExpansionModule,
        MatDividerModule,
        MatListModule,
        MatTreeModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatStepperModule,
    ]
})
export class MaterialModule { }