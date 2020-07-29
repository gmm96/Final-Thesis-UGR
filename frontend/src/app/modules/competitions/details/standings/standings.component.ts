import {AfterViewInit, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {CompetitionsService} from "../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-league-table',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input('competition') competition;
    teamStats: any;
    teamStatsCompatible: any;
    displayedColumns: string[] = ['position', 'team', 'played', 'wins', 'losses', 'total_points', 'total_opponent_points', 'difference'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService
    ) {
    }

    async ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (this.competition) {
            (await this.setDataTable());
        }
    }

    async setDataTable() {
        if (this.competition) {
            try {
                this.teamStats = (await this.competitionsService.getCompetitionStandings(this.competition._id));
                if (this.teamStats) {
                    this.teamStatsCompatible = this.teamStats.map((teamSt, index) => {
                        let team = this.competition.teams.find(team => team._id.toString() === teamSt.teamID.toString());
                        return {
                            competitionID: teamSt.competitionID,
                            teamID: teamSt.teamID,
                            position: index + 1,
                            team: team.name,
                            played: teamSt.stats.playedGames,
                            wins: teamSt.stats.wonGames,
                            losses: teamSt.stats.playedGames - teamSt.stats.wonGames,
                            total_points: teamSt.stats.points,
                            total_opponent_points: teamSt.stats.opponentPoints,
                            difference: teamSt.stats.points - teamSt.stats.opponentPoints,
                        }
                    });
                    this.dataSource = new MatTableDataSource(this.teamStatsCompatible);
                    this.dataSource.sort = this.sort;
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
}

