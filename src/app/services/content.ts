import { Injectable, computed, inject } from '@angular/core';
import { TranslationService } from './translation.service';

export interface MenuItem {
  label: string;
  link: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features?: string[];
  equipment?: string[]; // Optional, for produce page
}

export interface PageItem {
  id: string;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  public translationService = inject(TranslationService);

  mainMenu = computed<MenuItem[]>(() => {
    const t = this.translationService.translations();
    return [
      { label: t.menu.home, link: '/' },
      { label: t.menu.delivery, link: '/delivery' },
      { label: t.menu.howToOrder, link: '/how-to-order' },
      { label: t.menu.reviews, link: '/reviews' },
      { label: t.menu.contacts, link: '/contacts' },
    ];
  });

  services = computed<ServiceItem[]>(() => {
    const t = this.translationService.translations().services;
    return Object.keys(t).map((id) => ({
      id,
      title: t[id].title,
      description: t[id].description,
      features: t[id].features,
      equipment: t[id].equipment,
    }));
  });

  trustIndicators = computed(() => {
    const t = this.translationService.translations().ui.trustIndicators;
    return [
      { icon: '📅', text: t.workingSince },
      { icon: '🏭', text: t.ownProduction },
      { icon: '🛡️', text: t.qualityGuarantee },
      { icon: '✅', text: t.completedProjects },
    ];
  });

  pages = computed<PageItem[]>(() => {
    const t = this.translationService.translations().pages;
    return Object.keys(t).map((id) => ({
      id,
      title: t[id].title,
      content: t[id].content,
    }));
  });

  contactInfo = {
    phone: '+998 (90) 123-45-67',
    email: 'info@metal-art.uz',
    address: 'ул. Промышленная, д. 45, Наманган',
  };

  getServiceById(id: string): ServiceItem | undefined {
    return this.services().find((s) => s.id === id);
  }

  getPageById(id: string): PageItem | undefined {
    return this.pages().find((p) => p.id === id);
  }
}
