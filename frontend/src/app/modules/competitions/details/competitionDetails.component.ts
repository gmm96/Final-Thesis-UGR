import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";

@Component({
    selector: 'app-competition-details',
    templateUrl: './competitionDetails.component.html',
    styleUrls: ['./competitionDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    currentTabField: CompetitionDetailsTabs;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.competitionID = params['id'];

            // localStorage.setItem("competitionID", this.competitionID)

            // get competitionID data from backend
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
