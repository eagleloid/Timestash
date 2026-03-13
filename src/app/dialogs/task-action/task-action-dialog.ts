import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { DeleteConfirmDialogComponent, DeleteConfirmResult } from '../delete-confirm/delete-confirm-dialog';

@Component({
  selector: 'app-task-action-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data.task.name }}</h2>
    @if (latestTimestamp) {
      <p class="latest-ts">{{ latestTimestamp }}</p>
    } @else {
      <p class="latest-ts muted">No timestamps yet</p>
    }
    <mat-dialog-content class="action-content">
      <button mat-flat-button class="timestamp-btn" (click)="addTimestamp()">
        Timestamp
      </button>
      <button mat-stroked-button color="warn" class="delete-btn" (click)="openDelete()">
        Delete
      </button>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { margin-bottom: 0 !important; word-break: break-word; }
    .latest-ts { margin: 4px 24px 0; font-size: 0.85rem; color: var(--mat-sys-on-surface-variant); }
    .muted { opacity: 0.5; }
    .action-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px !important;
    }
    .timestamp-btn { width: 100%; }
    .delete-btn { width: 60%; align-self: flex-start; }
  `],
})
export class TaskActionDialogComponent {
  get latestTimestamp(): string | null {
    const ts = this.data.task.timestamps;
    return ts.length ? this.taskService.formatTimestamp(ts[ts.length - 1]) : null;
  }

  constructor(
    private dialogRef: MatDialogRef<TaskActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  addTimestamp(): void {
    this.taskService.addTimestamp(this.data.task.id);
    // refresh the local reference by reading from the service
    const updated = this.taskService.tasks().find(t => t.id === this.data.task.id);
    if (updated) this.data = { task: updated };
  }

  openDelete(): void {
    const ref = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '320px',
      data: {
        taskName: this.data.task.name,
        hasTimestamps: this.data.task.timestamps.length > 0,
      },
    });

    ref.afterClosed().subscribe((result: DeleteConfirmResult) => {
      if (result === 'last') {
        this.taskService.deleteLastTimestamp(this.data.task.id);
        const updated = this.taskService.tasks().find(t => t.id === this.data.task.id);
        if (updated) this.data = { task: updated };
      } else if (result === 'all') {
        this.taskService.deleteTask(this.data.task.id);
        this.dialogRef.close();
      }
    });
  }
}
