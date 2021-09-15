import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {TeamDetailsComponent} from "./details/teamDetails.component";


const teamsRoutes: Routes = [
    {path: ':id', component: TeamDetailsComponent},

    {path: '**', component: TeamDetailsComponent}
];

@NgModule({
    declarations: [
        TeamDetailsComponent
    ],
    imports: [
        RouterModule.forChild(teamsRoutes),
        CommonModule,
        SharedModule
    ],
    providers: [
        TeamDetailsComponent,
    ],
    exports: [RouterModule]
})

export class TeamsModule {
}
