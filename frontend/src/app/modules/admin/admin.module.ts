import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {AdminComponent} from "./admin.component";
import {ManagePlayersComponent} from "./players/managePlayers.component";
import {ManageTeamsComponent} from "./teams/manageTeams.component";
import {AuthGuardService} from "../../core/auth/auth-guard.service";
import {CreateCompetitionComponent} from "./competitions/createCompetition.component";
import {ScheduleComponent} from "./schedule/schedule.component";


const adminRoutes: Routes = [
    {path: 'players', component: ManagePlayersComponent, canActivate: [AuthGuardService]},
    {path: 'teams', component: ManageTeamsComponent,  canActivate: [AuthGuardService]},
    {path: 'competitions', component: CreateCompetitionComponent,  canActivate: [AuthGuardService]},
    {path: 'schedule', component: ScheduleComponent,  canActivate: [AuthGuardService]},
    {path: '**', component: AdminComponent,  canActivate: [AuthGuardService]}
];

@NgModule({
    declarations: [
        AdminComponent,
        ManagePlayersComponent,
        ManageTeamsComponent,
        CreateCompetitionComponent,
        ScheduleComponent
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
        CreateCompetitionComponent,
        ScheduleComponent
    ],
    exports: [RouterModule]
})

export class AdminModule {
}
