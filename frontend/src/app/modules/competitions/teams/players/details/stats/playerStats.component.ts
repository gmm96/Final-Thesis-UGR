import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompetitionsService} from "../../../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-competition-player-stats',
    templateUrl: './playerStats.component.html',
    styleUrls: ['./playerStats.component.scss']
})
export class CompetitionPlayerStatsComponent implements OnInit, OnDestroy {

    @Input('competitionID') competitionID;
    @Input('teamID') teamID;
    @Input('playerID') playerID;
    competitionPlayerStats: any;
    tableData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService
    ) {
    }

    async ngOnInit() {
        (await this.setPlayerStats());
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        (await this.setPlayerStats());
    }

    async setPlayerStats() {
        if (this.competitionID && this.teamID && this.playerID) {
            (await this.getCompetitionPlayerStats());
            if (this.competitionPlayerStats) {
                this.tableData = [
                    {name: "Partidos jugados", value: this.competitionPlayerStats.stats.playedGames},
                    {name: "Puntos totales", value: this.competitionPlayerStats.stats.points},
                    {
                        name: "Puntos por partido",
                        value: (!this.competitionPlayerStats.stats.playedGames) ? 0 : Math.round(this.competitionPlayerStats.stats.points / this.competitionPlayerStats.stats.playedGames * 100) / 100
                    },
                    {name: "Faltas totales", value: this.competitionPlayerStats.stats.fouls},
                    {
                        name: "Faltas por partido",
                        value: (!this.competitionPlayerStats.stats.playedGames) ? 0 : Math.round(this.competitionPlayerStats.stats.fouls / this.competitionPlayerStats.stats.playedGames * 100) / 100
                    },
                ];
            } else {
                this.tableData = [
                    {name: "Partidos jugados", value: 0},
                    {name: "Puntos totales", value: 0},
                    {name: "Puntos por partido", value: 0},
                    {name: "Faltas totales", value: 0},
                    {name: "Faltas por partido", value: 0},
                ];
            }
        }
    }

    async getCompetitionPlayerStats() {
        try {
            this.competitionPlayerStats = (await this.competitionsService.getCompetitionPlayerStats(this.competitionID, this.teamID, this.playerID));
        } catch (e) {
            console.error(e);
        }
    }

}
