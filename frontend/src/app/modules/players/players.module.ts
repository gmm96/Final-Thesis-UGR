import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PlayerDetailsComponent} from "./details/playerDetails.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";


const playersRoutes: Routes = [
    {path: ':id', component: PlayerDetailsComponent},

    {path: '**', component: PlayerDetailsComponent}
];

@NgModule({
    declarations: [
        PlayerDetailsComponent
    ],
    imports: [
        RouterModule.forChild(playersRoutes),
        CommonModule,
        SharedModule
    ],
    providers: [
        PlayerDetailsComponent,
    ],
    exports: [RouterModule]
})

export class PlayersModule {
}
