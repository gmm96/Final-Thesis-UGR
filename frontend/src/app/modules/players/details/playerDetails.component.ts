import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";
import {PlayersService} from "../../../core/services/players/players.service";

@Component({
    selector: 'app-player-details',
    templateUrl: './playerDetails.component.html',
    styleUrls: ['./playerDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class PlayerDetailsComponent implements OnInit, OnDestroy {

    playerID: string;
    player: any;
    currentTabField: PlayerDetailsTabs = PlayerDetailsTabs.info;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private playersService: PlayersService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.playerID = params['id'];
            this.player = (await this.playersService.getPlayerInformation(this.playerID));
            if (this.player) {
                if (this.player.avatar) this.player.avatar = 'http://localhost:3000' + this.player.avatar;
                this.changeDetectorRef.detectChanges();
            }
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

    getPlayerDetailsTabs() {
        return PlayerDetailsTabs;
    }

    goToTeamPage() {
        if (this.player.team) this.router.navigate(["/teams/" + this.player.team._id]);
    }
};

export enum PlayerDetailsTabs {
    info = "INFORMACIÓN",
    competitions = "COMPETICIONES",
    stats = "ESTADÍSTICAS"
}