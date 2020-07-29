import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayersService} from "../../../../core/services/players/players.service";

@Component({
    selector: 'app-player-stats',
    templateUrl: './playerStats.component.html',
    styleUrls: ['./playerStats.component.scss']
})
export class PlayerStatsComponent implements OnInit, OnDestroy {

    @Input('playerID') playerID;
    competitionPlayerStats: any = [];
    tableData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private playersService: PlayersService
    ) {
    }

    async ngOnInit() {
        (await this.setTableData());
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        (await this.setTableData());
    }

    async setTableData() {
        if (this.playerID) {
            (await this.getCompetitionPlayerStats());
            this.tableData = [
                {name: "Partidos jugados", value: this.competitionPlayerStats.stats.playedGames},
                {name: "Puntos totales", value: this.competitionPlayerStats.stats.points},
                {name: "Puntos por partido", value: (this.competitionPlayerStats.stats.playedGames)? this.competitionPlayerStats.stats.points / this.competitionPlayerStats.stats.playedGames : 0},
                {name: "Faltas totales", value: this.competitionPlayerStats.stats.fouls },
                {name: "Faltas por partido", value: (this.competitionPlayerStats.stats.playedGames)? this.competitionPlayerStats.stats.fouls / this.competitionPlayerStats.stats.playedGames : 0},
            ];
        }
    }

    async getCompetitionPlayerStats() {
        try {
            this.competitionPlayerStats = (await this.playersService.getAverageCompetitionPlayerStats(this.playerID));
        } catch (e) {
            console.error(e);
        }
    }
}
