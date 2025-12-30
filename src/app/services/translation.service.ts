import { computed, Injectable, signal } from '@angular/core';
import { TRANSLATIONS_RU } from './translations.ru';
import { TRANSLATIONS_UZ } from './translations.uz';

export type Language = 'ru' | 'uz';

export interface Translation {
  menu: {
    home: string;
    delivery: string;
    howToOrder: string;
    articles: string;
    reviews: string;
    contacts: string;
    callback: string;
  };
  services: Record<
    string,
    {
      title: string;
      description: string;
      features?: string[];
      equipment?: string[];
    }
  >;
  pages: Record<
    string,
    {
      title: string;
      content: string;
    }
  >;
  ui: {
    since: string;
    trustIndicators: {
      workingSince: string;
      ownProduction: string;
      qualityGuarantee: string;
      completedProjects: string;
    };
    callbackForm?: {
      subtitle: string;
      name: string;
      namePlaceholder: string;
      nameError: string;
      phone: string;
      phonePlaceholder: string;
      phoneError: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitError: string;
      successTitle: string;
      successMessage: string;
    };
  };
  home: {
    hero: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
      watchProduction: string;
      contactUs: string;
      qualityTitle: string;
      qualityDescription: string;
    };
    stats: {
      clients: string;
      experience: string;
      projects: string;
      quality: string;
    };
    features: {
      title: string;
      subtitle: string;
      individual: { title: string; description: string };
      fast: { title: string; description: string };
      guarantee: { title: string; description: string };
      pricing: { title: string; description: string };
      fullCycle: { title: string; description: string };
      experts: { title: string; description: string };
    };
    cta: {
      title: string;
      description: string;
      getConsultation: string;
      viewWorks: string;
    };
  };
  footer: {
    description: string;
    quickLinks: string;
    ourServices: string;
    contactsTitle: string;
    links: {
      home: string;
      production: string;
      delivery: string;
      howToOrder: string;
      articles: string;
      reviews: string;
    };
    services: {
      stainlessSteel: string;
      metalStructures: string;
      laserCutting: string;
      metalBending: string;
      welding: string;
      powderCoating: string;
    };
    contacts: {
      address: string;
      workingHours: string;
    };
    copyright: string;
    legal: {
      privacy: string;
      terms: string;
    };
  };
  sidebar: {
    ourServices: string;
    whyTrustUs: string;
  };
  header: {
    address: string;
  };
}

const STORAGE_KEY = 'app_language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguage = signal<Language>(this.getInitialLanguage());

  // Public computed signal for components to subscribe to
  public language = this.currentLanguage.asReadonly();

  // Computed translation object based on current language
  public translations = computed<Translation>(() => {
    return this.currentLanguage() === 'ru' ? TRANSLATIONS_RU : TRANSLATIONS_UZ;
  });

  constructor() {
    // Save initial language to localStorage if not set
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.saveLanguage(this.currentLanguage());
    }
  }

  private getInitialLanguage(): Language {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'uz' || saved === 'ru' ? saved : 'ru';
  }

  private saveLanguage(lang: Language): void {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  public setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    this.saveLanguage(lang);
  }

  public getLanguageName(lang: Language): string {
    return lang === 'ru' ? 'Русский' : "O'zbekcha";
  }
}
