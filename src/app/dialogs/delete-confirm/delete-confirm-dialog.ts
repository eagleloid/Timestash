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
  templateUrl: './delete-confirm-dialog.html',
  styleUrl: './delete-confirm-dialog.scss',
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
