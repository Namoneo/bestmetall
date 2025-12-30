import { Component, inject, signal } from '@angular/core';
import { Language, TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.css'],
})
export class LanguageSwitcherComponent {
  translationService = inject(TranslationService);
  isOpen = signal(false);

  languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  ];

  toggleDropdown() {
    this.isOpen.update((value) => !value);
  }

  selectLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
    this.isOpen.set(false);
  }

  getCurrentLanguage() {
    const currentLang = this.translationService.language();
    return this.languages.find((l) => l.code === currentLang);
  }
}
