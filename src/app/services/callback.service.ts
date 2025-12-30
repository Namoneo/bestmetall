import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CallbackService {
  private isOpenSignal = signal(false);

  // Expose as read-only signal
  public isOpen = this.isOpenSignal.asReadonly();

  open() {
    this.isOpenSignal.set(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpenSignal.set(false);
    // Restore scrolling
    document.body.style.overflow = '';
  }
}
