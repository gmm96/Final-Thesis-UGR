import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";

@Component({
    selector: 'app-team-details',
    templateUrl: './teamDetails.component.html',
    styleUrls: ['./teamDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class TeamDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    currentTabField: TeamDetailsTabs = TeamDetailsTabs.info;
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
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openTeamInfo() {
        this.currentTabField = TeamDetailsTabs.info;
    }
    openTeamRoster() {
        this.currentTabField = TeamDetailsTabs.roster;
    }
    openCompetitions() {
        this.currentTabField = TeamDetailsTabs.competitions;
    }

    getTeamDetailsTabs () {
        return TeamDetailsTabs;
    }
};

export enum TeamDetailsTabs {
    info = "INFORMACIÓN",
    roster = "PLANTILLA",
    competitions = "COMPETICIONES",

}
