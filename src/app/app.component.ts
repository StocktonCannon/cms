import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  // template: '<h1>Hello World!</h1>',
  templateUrl: './app.component.html',
  // styles: ['body: color: pink'],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';
  selectedFeature = 'documents'

  switchView(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
  }
}
