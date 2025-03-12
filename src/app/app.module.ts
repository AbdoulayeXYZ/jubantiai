import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module'; // Importer les routes principales

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // Fournir les routes ici
  ]
});
