import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompetitionsService} from "../../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-team-next-games',
    templateUrl: './nextGames.component.html',
    styleUrls: ['./nextGames.component.scss']
})
export class TeamNextGamesComponent implements OnInit, OnDestroy {

    @Input('competitionID') competitionID;
    @Input('teamID') teamID;
    games: any = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService
    ) {
    }

    async ngOnInit() {
        (await this.getNextTeamGamesInCompetition());
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        (await this.getNextTeamGamesInCompetition());
    }

    async getNextTeamGamesInCompetition() {
        try {
            if (this.competitionID && this.teamID) {
                this.games = (await this.competitionsService.getNextTeamGamesInCompetition(this.competitionID, this.teamID));
            }
        } catch (e) {
            console.error(e);
        }
    }

}
