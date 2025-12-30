import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CallbackService } from '../../../services/callback.service';
import { ContentService } from '../../../services/content';
import { TranslationService } from '../../../services/translation.service';
import { LanguageSwitcherComponent } from '../../language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageSwitcherComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  contentService = inject(ContentService);
  translationService = inject(TranslationService);
  callbackService = inject(CallbackService);

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
  }

  openCallbackForm() {
    this.callbackService.open();
    this.isMenuOpen.set(false);
  }
}
