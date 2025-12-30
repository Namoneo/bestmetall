import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CallbackFormComponent } from '../../callback-form/callback-form';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar, Footer, CallbackFormComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
