import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {CompetitionsService} from "../../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-team-prev-games',
    templateUrl: './prevGames.component.html',
    styleUrls: ['./prevGames.component.scss']
})
export class TeamPrevGamesComponent implements OnInit, OnDestroy {

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
        (await this.getPrevTeamGamesInCompetition());
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        (await this.getPrevTeamGamesInCompetition());
    }

    async getPrevTeamGamesInCompetition() {
        try {
            if (this.competitionID && this.teamID) {
                this.games = (await this.competitionsService.getPrevTeamGamesInCompetition(this.competitionID, this.teamID));
            }
        } catch (e) {
            console.error(e);
        }
    }

}
