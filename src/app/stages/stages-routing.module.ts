import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StageBaseComponent} from './stage-base/stage-base.component';

const routes: Routes = [
  {
    path: 'level1',
    component: StageBaseComponent
  },
  {
    path: '**',
    redirectTo: 'level1'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StagesRoutingModule { }
