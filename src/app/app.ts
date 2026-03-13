import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';

import { TaskService } from './services/task.service';
import { Task } from './models/task.model';
import { AddTaskDialogComponent } from './dialogs/add-task/add-task-dialog';
import { TaskActionDialogComponent } from './dialogs/task-action/task-action-dialog';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatRippleModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  readonly tasks;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
  ) {
    this.tasks = taskService.tasks;
  }

  formatTimestamp(iso: string): string {
    return this.taskService.formatTimestamp(iso);
  }

  openAddTask(): void {
    const ref = this.dialog.open(AddTaskDialogComponent, {
      width: '320px',
      autoFocus: 'input',
    });
    ref.afterClosed().subscribe((name: string | undefined) => {
      if (name) this.taskService.addTask(name);
    });
  }

  openTaskAction(task: Task): void {
    this.dialog.open(TaskActionDialogComponent, {
      width: '320px',
      data: { task },
    });
  }
}
