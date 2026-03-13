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
  template: `
    <div class="app-shell">
      <!-- Header -->
      <mat-toolbar color="primary" class="app-header">
        <span class="app-title">Timestash</span>
      </mat-toolbar>

      <!-- Task List -->
      <main class="task-list-container">
        @if (tasks().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">timer</mat-icon>
            <p>No tasks yet.</p>
            <p class="hint">Tap <strong>+</strong> to add your first task.</p>
          </div>
        }

        @for (task of tasks(); track task.id) {
          <div class="task-row" matRipple (click)="openTaskAction(task)">
            <div class="task-info">
              <span class="task-name">{{ task.name }}</span>
              <span class="task-ts">
                @if (task.timestamps.length > 0) {
                  {{ formatTimestamp(task.timestamps[task.timestamps.length - 1]) }}
                } @else {
                  <span class="no-ts">—</span>
                }
              </span>
            </div>
            <button
              mat-icon-button
              class="task-action-btn"
              aria-label="Task actions"
              (click)="$event.stopPropagation(); openTaskAction(task)"
            >
              <mat-icon>add_circle_outline</mat-icon>
            </button>
          </div>
        }
      </main>

      <!-- FAB -->
      <div class="fab-container">
        <button
          mat-fab
          color="primary"
          aria-label="Add task"
          (click)="openAddTask()"
          class="add-fab"
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <!-- Footer spacer so FAB doesn't overlap last item -->
      <div class="footer-spacer"></div>
    </div>
  `,
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
