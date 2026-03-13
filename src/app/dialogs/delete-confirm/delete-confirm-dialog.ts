import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
export interface DeleteConfirmData {
  taskName: string;
  hasTimestamps: boolean;
}

export type DeleteConfirmResult = 'last' | 'all' | null;

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete</h2>
    <mat-dialog-content class="delete-content">
      <p class="task-name">{{ data.taskName }}</p>
      <div class="delete-actions">
        <button
          mat-stroked-button
          color="warn"
          [disabled]="!data.hasTimestamps"
          (click)="clickDelete('last')"
          class="delete-btn"
        >
          {{ lastLabel }}
        </button>
        <button
          mat-flat-button
          color="warn"
          (click)="clickDelete('all')"
          class="delete-btn"
        >
          {{ allLabel }}
        </button>
        <button mat-button mat-dialog-close class="cancel-btn">Cancel</button>
      </div>
    </mat-dialog-content>
  `,
  styles: [`
    .delete-content { display: flex; flex-direction: column; gap: 16px; padding-top: 8px !important; }
    .task-name { margin: 0; font-weight: 500; font-size: 1rem; }
    .delete-actions { display: flex; flex-direction: column; gap: 10px; }
    .delete-btn { width: 100%; }
    .cancel-btn { width: 100%; }
  `],
})
export class DeleteConfirmDialogComponent {
  lastLabel = 'Delete Last Entry';
  allLabel = 'Delete Entire Task';

  private lastPending = false;
  private allPending = false;

  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmData
  ) {}

  clickDelete(type: 'last' | 'all'): void {
    if (type === 'last') {
      if (this.lastPending) {
        this.dialogRef.close('last');
      } else {
        this.lastPending = true;
        this.lastLabel = 'Confirm?';
      }
    } else {
      if (this.allPending) {
        this.dialogRef.close('all');
      } else {
        this.allPending = true;
        this.allLabel = 'Confirm?';
      }
    }
  }
}
