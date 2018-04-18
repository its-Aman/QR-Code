import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectActiveEventPage } from './select-active-event';

@NgModule({
  declarations: [
    SelectActiveEventPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectActiveEventPage),
  ],
})
export class SelectActiveEventPageModule {}
