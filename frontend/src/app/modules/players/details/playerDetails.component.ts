import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";

@Component({
    selector: 'app-player-details',
    templateUrl: './playerDetails.component.html',
    styleUrls: ['./playerDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class PlayerDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    currentTabField: PlayerDetailsTabs = PlayerDetailsTabs.info;
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

    openPlayerInfo() {
        this.currentTabField = PlayerDetailsTabs.info;
    }
    openCompetitions() {
        this.currentTabField = PlayerDetailsTabs.competitions;
    }
    openPlayerStats() {
        this.currentTabField = PlayerDetailsTabs.stats;
    }

    getPlayerDetailsTabs () {
        return PlayerDetailsTabs;
    }
};

export enum PlayerDetailsTabs {
    info = "INFORMACIÓN",
    competitions = "COMPETICIONES",
    stats = "ESTADÍSTICAS"
}
