import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";
import {CompetitionsService} from "../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-competition-details',
    templateUrl: './competitionDetails.component.html',
    styleUrls: ['./competitionDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionDetailsComponent implements OnInit, OnDestroy {

    competition: any;
    competitionID: string;
    competitionNumberOfPlayers: number;
    currentTabField: CompetitionDetailsTabs;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private competitionsService: CompetitionsService,
    ) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.competitionID = params['competitionID'];
            this.competition = (await this.competitionsService.getFullCompetitionInfo(this.competitionID));
            this.competitionNumberOfPlayers = this.competition.teams.reduce((sum, current) => sum + current.players.length, 0);
            this.changeDetectorRef.detectChanges();
        });
        this.currentTabField = CompetitionDetailsTabs.calendar;
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

    getCompetitionDetailsTabs() {
        return CompetitionDetailsTabs;
    }
};

export enum CompetitionDetailsTabs {
    calendar = "CALENDARIO",
    standings = "CLASIFICACIÓN",
    playoffs = "PLAYOFFS"
}
