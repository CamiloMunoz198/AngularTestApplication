import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
}
