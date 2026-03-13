import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { DeleteConfirmDialogComponent, DeleteConfirmResult } from '../delete-confirm/delete-confirm-dialog';

@Component({
  selector: 'app-task-action-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './task-action-dialog.html',
  styleUrl: './task-action-dialog.scss',
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
