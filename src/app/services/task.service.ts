import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'timestash_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _tasks = signal<Task[]>(this.load());

  readonly tasks = this._tasks.asReadonly();

  private load(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._tasks()));
  }

  addTask(name: string): void {
    const task: Task = {
      id: crypto.randomUUID(),
      name: name.trim(),
      timestamps: [],
    };
    this._tasks.update(tasks => [task, ...tasks]);
    this.save();
  }

  addTimestamp(taskId: string): void {
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? { ...t, timestamps: [...t.timestamps, new Date().toISOString()] }
          : t
      )
    );
    this.save();
  }

  deleteLastTimestamp(taskId: string): void {
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? { ...t, timestamps: t.timestamps.slice(0, -1) }
          : t
      )
    );
    this.save();
  }

  deleteTask(taskId: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== taskId));
    this.save();
  }

  formatTimestamp(iso: string): string {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const mon = months[d.getMonth()];
    const year = d.getFullYear();
    return `${hh}:${mm} ${day}${mon}${year}`;
  }
}
