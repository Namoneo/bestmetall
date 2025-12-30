import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CallbackService } from '../../services/callback.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-callback-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './callback-form.html',
  styleUrl: './callback-form.css',
})
export class CallbackFormComponent {
  callbackService = inject(CallbackService);
  translationService = inject(TranslationService);

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  callbackForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)],
    }),
    message: new FormControl('', {
      nonNullable: true,
    }),
  });

  onSubmit() {
    if (this.callbackForm.invalid) {
      this.callbackForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);

      // Auto close after success
      setTimeout(() => {
        this.close();
        // Reset after modal animation
        setTimeout(() => this.reset(), 300);
      }, 2000);
    }, 1500);
  }

  close() {
    this.callbackService.close();
  }

  reset() {
    this.callbackForm.reset();
    this.submitSuccess.set(false);
    this.submitError.set(false);
  }
}
