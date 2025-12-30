import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentService } from '../../services/content';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contentService = inject(ContentService);
  translationService = inject(TranslationService);

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  contactForm = new FormGroup({
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
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(false);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
    }, 1500);
  }

  reset() {
    this.contactForm.reset();
    this.submitSuccess.set(false);
    this.submitError.set(false);
  }
}
