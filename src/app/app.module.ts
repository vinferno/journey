import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from './core/core.module';
import {StagesModule} from './stages/stages.module';
import {BeingsModule} from './beings/beings.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    StagesModule,
    BeingsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
