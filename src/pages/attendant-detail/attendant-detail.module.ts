import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendantDetailPage } from './attendant-detail';

@NgModule({
  declarations: [
    AttendantDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendantDetailPage),
  ],
})
export class AttendantDetailPageModule {}
