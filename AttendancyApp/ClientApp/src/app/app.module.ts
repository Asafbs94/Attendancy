import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LocationSenderComponent } from './location-sender/location-sender.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignalrService } from './signalr.service';

@NgModule({
  declarations: [
    AppComponent,
    LocationSenderComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

  ],
  providers: [SignalrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
