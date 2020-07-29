import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";
import {CompetitionsService} from "../../../core/services/competitions/competitions.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-competition-details',
    templateUrl: './competitionDetails.component.html',
    styleUrls: ['./competitionDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionDetailsComponent implements OnInit, OnDestroy {

    competition: any;
    competitionID: string;
    teamStats: any;
    competitionNumberOfPlayers: number;
    currentTabField: CompetitionDetailsTabs;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private competitionsService: CompetitionsService,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.competitionID = params['competitionID'];
            this.competition = (await this.competitionsService.getFullCompetitionInfo(this.competitionID));
            this.competitionNumberOfPlayers = this.competition.teams.reduce((sum, current) => sum + current.players.length, 0);
            this.teamStats = (await this.competitionsService.getCompetitionStandings(this.competitionID));
            this.titleService.setTitle((this.competition) ? this.competition.name + " - Competiciones" : "Competiciones");
            this.changeDetectorRef.detectChanges();
        });
        this.currentTabField = CompetitionDetailsTabs.teams;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openCalendar() {
        this.currentTabField = CompetitionDetailsTabs.calendar;
    }

    openStandings() {
        this.currentTabField = CompetitionDetailsTabs.standings;
    }

    openPlayoffs() {
        this.currentTabField = CompetitionDetailsTabs.playoffs
    }

    openTeamList() {
        this.currentTabField = CompetitionDetailsTabs.teams;
    }

    getCompetitionDetailsTabs() {
        return CompetitionDetailsTabs;
    }
};

export enum CompetitionDetailsTabs {
    calendar = "CALENDARIO",
    standings = "CLASIFICACIÓN",
    playoffs = "PLAYOFFS",
    teams = "EQUIPOS"
}
