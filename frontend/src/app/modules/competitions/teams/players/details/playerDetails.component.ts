import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../../../shared/animations";

@Component({
    selector: 'app-competition-player-details',
    templateUrl: './playerDetails.component.html',
    styleUrls: ['./playerDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionPlayerDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    currentTabField: TeamDetailsTabs = TeamDetailsTabs.nextGames;
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

    goToPlayerPage () {
        this.router.navigate(['/players/hola']);
    }


    getTeamDetailsTabs () {
        return TeamDetailsTabs;
    }
};

export enum TeamDetailsTabs {
    nextGames = 'PARTIDOS POST.',
    prevGames = 'PARTIDOS ANT.',
    stats = 'ESTADÍSTICAS'
}
