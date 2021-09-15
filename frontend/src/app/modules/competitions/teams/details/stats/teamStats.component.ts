import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompetitionsService} from "../../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-team-stats',
    templateUrl: './teamStats.component.html',
    styleUrls: ['./teamStats.component.scss']
})
export class TeamStatsComponent implements OnInit, OnDestroy {

    @Input('competitionID') competitionID;
    @Input('teamID') teamID;
    competitionTeamStats: any;
    tableData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService
    ) {
    }

    async ngOnInit() {
        (await this.setTeamStats());
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        (await this.setTeamStats());
    }

    async setTeamStats() {
        if (this.competitionID && this.teamID) {
            (await this.getCompetitionTeamStats());
            if (this.competitionTeamStats) {
                this.tableData = [
                    {name: "Partidos jugados", value: this.competitionTeamStats.stats.playedGames},
                    {name: "Partidos ganados", value: this.competitionTeamStats.stats.wonGames},
                    {name: "Partidos perdidos", value: this.competitionTeamStats.stats.playedGames - this.competitionTeamStats.stats.wonGames},
                    {name: "Puntos anotados", value: this.competitionTeamStats.stats.points },
                    {name: "Puntos encajados", value: this.competitionTeamStats.stats.opponentPoints},
                    {name: "Diferencia de puntos", value: this.competitionTeamStats.stats.points - this.competitionTeamStats.stats.opponentPoints},
                ];
            } else {
                this.tableData = [
                    {name: "Partidos jugados", value: 0},
                    {name: "Partidos ganados", value: 0},
                    {name: "Partidos perdidos", value: 0},
                    {name: "Puntos anotados", value: 0 },
                    {name: "Puntos encajados", value: 0},
                    {name: "Diferencia de puntos", value: 0},
                ];
            }
        }
    }

    async getCompetitionTeamStats() {
        try {
            this.competitionTeamStats = (await this.competitionsService.getCompetitionTeamStats(this.competitionID, this.teamID));
        } catch (e) {
            console.error(e);
        }
    }
}
