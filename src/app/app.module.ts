import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';

@NgModule({
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  declarations: [AppComponent],
  entryComponents: [],
  providers: [
    TextToSpeech,
    SpeechRecognition,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
