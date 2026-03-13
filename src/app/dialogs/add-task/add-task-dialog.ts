import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-task-dialog',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
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
