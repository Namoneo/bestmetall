import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CallbackService } from '../../services/callback.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  translationService = inject(TranslationService);
  callbackService = inject(CallbackService);
}
