import { Component } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { LoaderService } from './shared/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-prac';
  isLoading: Subject<boolean> = this._loaderService.isLoading;

  constructor(private _loaderService: LoaderService) {
  }
}
