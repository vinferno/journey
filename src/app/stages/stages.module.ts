import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageBaseComponent } from './stage-base/stage-base.component';
import {StagesRoutingModule} from './stages-routing.module';
import {BeingsModule} from '../beings/beings.module';

@NgModule({
  imports: [
    CommonModule,
    StagesRoutingModule,
    BeingsModule,
  ],
  declarations: [StageBaseComponent]
})
export class StagesModule { }
