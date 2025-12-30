import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CallbackService } from '../../services/callback.service';
import { ContentService, PageItem } from '../../services/content';

@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './static-page.html',
  styleUrl: './static-page.css',
})
export class StaticPage {
  contentService = inject(ContentService);
  callbackService = inject(CallbackService);
  route = inject(ActivatedRoute);

  currentPage = signal<PageItem | undefined>(undefined);

  constructor() {
    // Use effect to reactively handle route data changes
    effect(() => {
      this.route.data.subscribe((data) => {
        const id = data['id'];
        console.log('StaticPage: Received data id:', id);
        console.log('StaticPage: Available pages:', this.contentService.pages);
        if (id) {
          this.currentPage.set(this.contentService.getPageById(id));
          console.log('StaticPage: Found page:', this.currentPage());
        }
      });

      // Also subscribe to params in case we use a generic route /page/:id
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.currentPage.set(this.contentService.getPageById(id));
        }
      });
    });
  }
}
