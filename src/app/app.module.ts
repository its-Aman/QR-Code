import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../providers/global/global';
import { HttpClientModule } from '@angular/common/http';

import { QRScanner } from '@ionic-native/qr-scanner';

@NgModule({
  declarations: [ 
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'md-arrow-back',
      iconMode: 'md',
      backButtonText: '',
      mode: 'md'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [ 
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalProvider,

    QRScanner
  ]
})
export class AppModule {}
