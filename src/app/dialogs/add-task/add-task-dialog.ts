import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-task-dialog',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>New Task</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Task Name</mat-label>
        <input
          matInput
          #nameInput
          [(ngModel)]="taskName"
          placeholder="e.g. Water plants"
          (keyup.enter)="confirm()"
          maxlength="60"
          autocomplete="off"
        />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button [disabled]="!taskName.trim()" (click)="confirm()">Add Task</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { padding-top: 8px !important; }
    .full-width { width: 100%; }
  `],
})
export class AddTaskDialogComponent {
  taskName = '';

  @ViewChild('nameInput') nameInput!: ElementRef;

  constructor(private dialogRef: MatDialogRef<AddTaskDialogComponent>) {}

  confirm(): void {
    if (this.taskName.trim()) {
      this.dialogRef.close(this.taskName.trim());
    }
  }
}
