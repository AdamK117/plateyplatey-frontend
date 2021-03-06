import {NgModule} from '@angular/core';
import {HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {BrowserModule} from '@angular/platform-browser';
import {PlateyComponent} from "./components/PlateyComponent";
import {PlateyAPI} from "./services/PlateyAPI";
import {FormsModule} from "@angular/forms";
import {UiCommand} from "./directives/UiCommand";
import {UiKeyup} from "./directives/UiKeyup";
import {PlateComponent} from "./components/PlateComponent";
import {CustomHttp} from "./services/CustomHttp";
import {PlateyTableComponent} from "./components/PlateyTableComponent";

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ PlateyComponent, UiCommand, UiKeyup, PlateComponent, PlateyTableComponent],
  providers: [
    PlateyAPI,
    {
      provide: CustomHttp,
      useFactory: (backend: XHRBackend, defaultOptions: RequestOptions) => {
        return new CustomHttp(backend, defaultOptions);
      },
      deps: [XHRBackend, RequestOptions]
    }
  ],
  bootstrap:    [ PlateyComponent ]
})
export class AppModule { }