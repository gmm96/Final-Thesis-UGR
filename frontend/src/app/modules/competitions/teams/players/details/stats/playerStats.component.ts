import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
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
                    {name: "Partidos totales", value: this.competitionPlayerStats.stats.points},
                    {name: "Partidos por partido", value: (!this.competitionPlayerStats.stats.playedGames)? 0 : this.competitionPlayerStats.stats.points / this.competitionPlayerStats.stats.playedGames},
                    {name: "Faltas totales", value: this.competitionPlayerStats.stats.fouls},
                    {name: "Faltas por partido", value: (!this.competitionPlayerStats.stats.playedGames)? 0 : this.competitionPlayerStats.stats.fouls / this.competitionPlayerStats.stats.playedGames },
                ];
            } else {
                this.tableData = [
                    {name: "Partidos jugados", value: 0},
                    {name: "Partidos totales", value: 0},
                    {name: "Partidos por partido", value: 0},
                    {name: "Faltas totales", value: 0},
                    {name: "Faltas por partido", value: 0 },
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
