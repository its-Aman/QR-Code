import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchAttendantsPage } from './search-attendants';

@NgModule({
  declarations: [
    SearchAttendantsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchAttendantsPage),
  ],
})
export class SearchAttendantsPageModule {}
