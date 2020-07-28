import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayersService} from "../../../../core/services/players/players.service";

@Component({
    selector: 'app-player-competitions',
    templateUrl: './playerCompetitions.component.html',
    styleUrls: ['./playerCompetitions.component.scss']
})
export class PlayerCompetitionsComponent implements OnInit, OnDestroy {

    @Input('playerID') playerID: any;
    competitions: Array<any> = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private playersService: PlayersService
    ) {
    }

    async ngOnInit() {
        if (this.playerID) {
            try {
                this.competitions = (await this.playersService.getPlayerCompetitions(this.playerID));
            } catch (e) {
                console.error(e);
            }
        }
    }

    ngOnDestroy() {
    }

}
