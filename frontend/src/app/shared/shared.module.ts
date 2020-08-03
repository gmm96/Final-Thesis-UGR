import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "./components/header/header.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material";
import {MatInputModule} from "@angular/material/input";
import {HomeComponent} from "../modules/home/home.component";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {AuthService} from "../core/auth/auth.service";
import {MatCardModule} from "@angular/material/card";
import {LoaderComponent} from "./components/loader/loader.component";
import {LottieAnimationViewModule} from "ng-lottie";
import {NotFoundComponent} from "./components/notFound/notFound.component";
import {HomeService} from "../core/services/home/home.service";
import {MatChipsModule} from "@angular/material/chips";
import {CalendarComponent} from "../modules/competitions/details/calendar/calendar.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {StandingsComponent} from "../modules/competitions/details/standings/standings.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {PlayoffsComponent} from "../modules/competitions/details/playoffs/playoffs.component";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatNativeDateModule,
    MatRippleModule
} from "@angular/material/core";
import {PlayoffsMatchupComponent} from "./components/playoffsMatchup/playoffsMatchup.component";
import {GameTableComponent} from "./components/gameTable/gameTable.component";
import {GameTableCollapsibleComponent} from "./components/gameTableCollapsible/gameTableCollapsible.component";
import {CdkDetailRowDirective} from "./components/gameTableCollapsible/cdk-detail-row.directive";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatPaginatorIntlSpa} from "./components/gameTable/spanish-paginator";
import {TeamNextGamesComponent} from "../modules/competitions/teams/details/nextGames/nextGames.component";
import {TeamPrevGamesComponent} from "../modules/competitions/teams/details/prevGames/prevGames.component";
import {PlayerTableComponent} from "./components/playerTable/playerTable.component";
import {CompetitionTeamRosterComponent} from "../modules/competitions/teams/details/teamRoster/teamRoster.component";
import {TeamStatsComponent} from "../modules/competitions/teams/details/stats/teamStats.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GameControlComponent} from "../modules/competitions/gameControl/gameControl.component";
import {MatMenuModule} from "@angular/material/menu";
import {SimpleTableComponent} from "./components/simpleTable/simpleTable.component";
import {PlayerInfoComponent} from "../modules/players/details/information/playerInfo.component";
import {CompetitionTableComponent} from "./components/competitionTable/competitionTable.component";
import {PlayerCompetitionsComponent} from "../modules/players/details/competitions/playerCompetitions.component";
import {TeamInfoComponent} from "../modules/teams/details/information/teamInfo.component";
import {TeamCompetitionsComponent} from "../modules/teams/details/competitions/teamCompetitions.component";
import {PlayerNextGamesComponent} from "../modules/competitions/teams/players/details/nextGames/nextGames.component";
import {PlayerPrevGamesComponent} from "../modules/competitions/teams/players/details/prevGames/prevGames.component";
import {TeamRosterComponent} from "../modules/teams/details/teamRoster/teamRoster.component";
import {CompetitionPlayerStatsComponent} from "../modules/competitions/teams/players/details/stats/playerStats.component";
import {PlayerStatsComponent} from "../modules/players/details/stats/playerStats.component";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatDividerModule} from "@angular/material/divider";
import {MatBadgeModule} from "@angular/material/badge";
import {MatSelectModule} from "@angular/material/select";
import {ClickOutsideModule} from "ng-click-outside";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {PlayersService} from "../core/services/players/players.service";
import {TeamsService} from "../core/services/teams/teams.service";
import {MatRadioModule} from "@angular/material/radio";
import {DisableControlDirective} from "../core/directives/disableControl.directive";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ToastrModule} from "ngx-toastr";
import {AuthGuardService} from "../core/auth/auth-guard.service";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MomentDateModule} from '@angular/material-moment-adapter';
import {CompetitionsService} from "../core/services/competitions/competitions.service";
import {TeamTableComponent} from "./components/teamTable/teamTable.component";
import {TeamListComponent} from "../modules/competitions/details/teamList/teamList.component";


@NgModule({
    declarations: [
        HeaderComponent,
        HomeComponent,
        LoaderComponent,
        NotFoundComponent,
        CalendarComponent,
        StandingsComponent,
        PlayoffsComponent,
        PlayoffsMatchupComponent,
        GameTableComponent,
        GameTableCollapsibleComponent,
        CdkDetailRowDirective,
        TeamNextGamesComponent,
        TeamPrevGamesComponent,
        PlayerTableComponent,
        CompetitionTeamRosterComponent,
        TeamStatsComponent,
        GameControlComponent,
        SimpleTableComponent,
        PlayerInfoComponent,
        CompetitionTableComponent,
        PlayerCompetitionsComponent,
        TeamInfoComponent,
        TeamCompetitionsComponent,
        PlayerNextGamesComponent,
        PlayerPrevGamesComponent,
        PlayerStatsComponent,
        TeamRosterComponent,
        CompetitionPlayerStatsComponent,
        DisableControlDirective,
        TeamTableComponent,
        TeamListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatCardModule,
        LottieAnimationViewModule.forRoot(),
        MatChipsModule,
        MatTableModule,
        MatSortModule,
        MatTabsModule,
        MatTooltipModule,
        MatRippleModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatBottomSheetModule,
        MatDividerModule,
        MatBadgeModule,
        MatSelectModule,
        ClickOutsideModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MaterialFileInputModule,
        MatCheckboxModule,
        ToastrModule.forRoot()
    ],
    providers: [
        AuthService,
        AuthGuardService,
        HomeService,
        PlayersService,
        TeamsService,
        CompetitionsService,
        {provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa},
        { provide: LOCALE_ID, useValue: 'es-ES' },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        HeaderComponent,
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        HomeComponent,
        MatSidenav,
        MatCardModule,
        LoaderComponent,
        LottieAnimationViewModule,
        NotFoundComponent,
        MatChipsModule,
        CalendarComponent,
        MatTableModule,
        MatSortModule,
        StandingsComponent,
        MatTabsModule,
        MatTooltipModule,
        PlayoffsComponent,
        MatRippleModule,
        PlayoffsMatchupComponent,
        GameTableComponent,
        GameTableCollapsibleComponent,
        CdkDetailRowDirective,
        MatPaginatorModule,
        TeamNextGamesComponent,
        TeamPrevGamesComponent,
        PlayerTableComponent,
        CompetitionTeamRosterComponent,
        TeamStatsComponent,
        GameControlComponent,
        MatAutocompleteModule,
        MatMenuModule,
        SimpleTableComponent,
        PlayerInfoComponent,
        CompetitionTableComponent,
        PlayerCompetitionsComponent,
        TeamInfoComponent,
        TeamCompetitionsComponent,
        PlayerNextGamesComponent,
        PlayerPrevGamesComponent,
        PlayerStatsComponent,
        TeamRosterComponent,
        CompetitionPlayerStatsComponent,
        MatBottomSheetModule,
        MatDividerModule,
        MatBadgeModule,
        MatSelectModule,
        ClickOutsideModule,
        MatSlideToggleModule,
        MatRadioModule,
        DisableControlDirective,
        MatDatepickerModule,
        MaterialFileInputModule,
        MatCheckboxModule,
        ToastrModule,
        TeamTableComponent,
        TeamListComponent
    ],
    schemas: [],
    entryComponents: []
})

export class SharedModule {
}
