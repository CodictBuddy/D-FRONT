import { SearchComponent } from './utils/search/search.component';
import { FooterComponent } from './landing/footer/footer.component';
import { HeaderComponent } from './landing/header/header.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@NgModule({
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  declarations: [AppComponent,FooterComponent],
  entryComponents: [],
  providers: [TextToSpeech,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
