import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {AdminComponent} from "./admin.component";
import {ManagePlayersComponent} from "./players/managePlayers.component";
import {ManageTeamsComponent} from "./teams/manageTeams.component";
import {AuthGuardService} from "../../core/auth/auth-guard.service";
import {CreateCompetitionComponent} from "./competitions/createCompetition.component";


const adminRoutes: Routes = [
    {path: 'players', component: ManagePlayersComponent, canActivate: [AuthGuardService]},
    {path: 'teams', component: ManageTeamsComponent,  canActivate: [AuthGuardService]},
    {path: 'competitions', component: CreateCompetitionComponent,  canActivate: [AuthGuardService]},
    {path: '**', component: AdminComponent,  canActivate: [AuthGuardService]}
];

@NgModule({
    declarations: [
        AdminComponent,
        ManagePlayersComponent,
        ManageTeamsComponent,
        CreateCompetitionComponent
    ],
    imports: [
        RouterModule.forChild(adminRoutes),
        CommonModule,
        SharedModule
    ],
    providers: [
        AdminComponent,
        ManagePlayersComponent,
        ManageTeamsComponent,
        CreateCompetitionComponent
    ],
    exports: [RouterModule]
})

export class AdminModule {
}
