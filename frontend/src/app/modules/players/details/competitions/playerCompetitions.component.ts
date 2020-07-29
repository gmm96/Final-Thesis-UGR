import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayersService} from "../../../../core/services/players/players.service";

@Component({
    selector: 'app-player-competitions',
    templateUrl: './playerCompetitions.component.html',
    styleUrls: ['./playerCompetitions.component.scss']
})
export class PlayerCompetitionsComponent implements OnInit, OnDestroy {

    @Input('playerID') playerID: string;
    competitions: Array<any> = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private playersService: PlayersService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {
        if (this.playerID) {
            (await this.getCompetitions());
        }
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (this.playerID) {
            (await this.getCompetitions());
        }
    }

    ngOnDestroy() {
    }

    async getCompetitions() {
        try {
            this.competitions = (await this.playersService.getPlayerCompetitions(this.playerID));
            this.changeDetectorRef.detectChanges();
        } catch (e) {
            console.error(e);
            this.competitions = [];
        }
    }
}
