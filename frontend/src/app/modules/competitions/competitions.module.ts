import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CompetitionDetailsComponent} from "./details/competitionDetails.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {CompetitionTeamDetailsComponent} from "./teams/details/teamDetails.component";
import {NotFoundComponent} from "../../shared/components/notFound/notFound.component";
import {CompetitionPlayerDetailsComponent} from "./teams/players/details/playerDetails.component";
import {GameControlComponent} from "../../shared/components/gameControl/gameControl.component";


const competitionsRoutes: Routes = [
    // {path: 'new', component}
    {path: ':competitionID/teams/:teamID/players/:playerID', component: CompetitionPlayerDetailsComponent},
    {path: ':competitionID/teams/:teamID', component: CompetitionTeamDetailsComponent},
    {path: ':competitionID', component: CompetitionDetailsComponent},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    declarations: [
        CompetitionDetailsComponent,
        CompetitionTeamDetailsComponent,
        CompetitionPlayerDetailsComponent
    ],
    imports: [
        RouterModule.forChild(competitionsRoutes),
        CommonModule,
        SharedModule
    ],
    providers: [
        CompetitionDetailsComponent,
        CompetitionTeamDetailsComponent,
        CompetitionPlayerDetailsComponent
    ],
    exports: [RouterModule]
})

export class CompetitionsModule {
}
