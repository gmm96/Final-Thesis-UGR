import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../../shared/animations";

@Component({
    selector: 'app-competition-team-details',
    templateUrl: './teamDetails.component.html',
    styleUrls: ['./teamDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionTeamDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    currentTabField: TeamDetailsTabs = TeamDetailsTabs.roster;
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

    openTeamRoster() {
        this.currentTabField = TeamDetailsTabs.roster;
    }
    openNextGames() {
        this.currentTabField = TeamDetailsTabs.nextGames;
    }

    openPrevGames() {
        this.currentTabField = TeamDetailsTabs.prevGames;
    }

    openTeamStats () {
        this.currentTabField = TeamDetailsTabs.stats;
    }

    goToTeamPage () {
        this.router.navigate(['/teams/hola']);
    }

    goToCompetitionPage () {
        this.router.navigate(['/competitions/hola']);
    }


    getTeamDetailsTabs () {
        return TeamDetailsTabs;
    }
};

export enum TeamDetailsTabs {
    roster = "PLANTILLA",
    nextGames = 'PARTIDOS POST.',
    prevGames = 'PARTIDOS ANT.',
    stats = 'ESTADÍSTICAS'
}
