import { NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallbackService } from '../../services/callback.service';
import { ContentService, ServiceItem } from '../../services/content';

@Component({
  selector: 'app-produce',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './produce.html',
  styleUrl: './produce.css',
})
export class Produce {
  contentService = inject(ContentService);
  callbackService = inject(CallbackService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentService = signal<ServiceItem | undefined>(undefined);
  selectedImage = signal<string | null>(null);

  private serviceGalleryMap: Record<string, string[]> = {
    stairs: ['assets/images/gallery/stairs_railings.png'],
    loft: ['assets/images/gallery/loft_furniture.png'],
    produce: ['assets/images/gallery/industrial_metal_processing.png'],
    mailboxes: ['assets/images/gallery/industrial_metal_processing.png'], // Fallback until specific image available
  };

  getGalleryImages(): string[] {
    const service = this.currentService();
    if (!service) return [];
    return this.serviceGalleryMap[service.id] || [];
  }

  openLightbox(image: string) {
    this.selectedImage.set(image);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLightbox() {
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }

  constructor() {
    // Use effect to reactively handle route parameter changes
    effect(() => {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        // If no ID (root path maybe), default to 'produce'
        const serviceId = id || 'produce';
        this.currentService.set(this.contentService.getServiceById(serviceId));

        // Also handle data passed from route config (for specific paths)
        const routeDataId = this.route.snapshot.data['id'];
        if (!id && routeDataId) {
          this.currentService.set(this.contentService.getServiceById(routeDataId));
        }
      });
    });
  }
}
