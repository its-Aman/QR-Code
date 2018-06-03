import { DatabaseProvider } from './../providers/database/database';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NativeAudio } from '@ionic-native/native-audio';

import { GlobalProvider } from '../providers/global/global';
import { NoopInterceptor } from '../providers/Interceptor/interceptor';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'md-arrow-back',
      iconMode: 'md',
      backButtonText: '',
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    StatusBar,
    SplashScreen,
    GlobalProvider,
    DatabaseProvider,
    QRScanner,
    Diagnostic,
    NativeAudio,
  ]
})
export class AppModule { }
