import { Component, HostListener, inject, VERSION } from '@angular/core';
import { DataFireBaseRealTimeService } from './services/data-fire-base-real-time.service';

@Component({
  selector: 'my-app',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
  private firebaseService = inject(DataFireBaseRealTimeService);

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  resetearPorInteraccion() {
    // Si hay un token, reseteamos el reloj por cualquier interacción física
    if (localStorage.getItem('session_token')) {
      this.firebaseService.resetearRelojInactividad();
    }
  }

}
