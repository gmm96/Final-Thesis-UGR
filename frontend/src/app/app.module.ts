import {NgModule} from "@angular/core";
import {SharedModule} from './shared/shared.module'
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from "./modules/login/login.component";
import {CompetitionsModule} from "./modules/competitions/competitions.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconRegistry} from "@angular/material/icon";
import {BrowserModule, DomSanitizer} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RequestInterceptor} from "./core/interceptors/request.interceptor";
import {TeamsModule} from "./modules/teams/teams.module";
import {PlayersModule} from "./modules/players/players.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
        CompetitionsModule,
        TeamsModule,
        PlayersModule
    ],
    providers: [
        LoginComponent,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestInterceptor,
        multi: true
    }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {

    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')); // Or whatever path you placed mdi.svg at
    }

}
