import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-playoffs-matchup',
    templateUrl: './playoffsMatchup.component.html',
    styleUrls: ['./playoffsMatchup.component.scss']
})
export class PlayoffsMatchupComponent implements OnInit, OnDestroy {

    @Input('games') games;
    gamesCompatible: any = [];
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.displayedColumns = ['localTeamName', 'gameStatus', 'visitorTeamName'];
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (this.games) {
            (await this.setTableData());
        }
    }

    async setTableData() {
        if (this.games) {
            this.gamesCompatible = this.games.map(game => {
                let gameStatus = {};
                if (!game.time || !game.location) {
                    gameStatus['result'] = " - ";
                    gameStatus['text'] = "Sin programar";
                } else {
                    if (!game.localTeamInfo.quarterStats || !game.localTeamInfo.quarterStats.length) {
                        gameStatus['date'] = new Date(game.time).toLocaleDateString("es-ES");
                        gameStatus['time'] = new Date(game.time).toLocaleTimeString("es-ES", {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } else {
                        let localPoints = game.localTeamInfo.quarterStats.reduce((sum, quarter) => sum + quarter.points, 0);
                        let visitorPoints = game.visitorTeamInfo.quarterStats.reduce((sum, quarter) => sum + quarter.points, 0);
                        gameStatus['result'] = localPoints + " - " + visitorPoints;
                        if (game.winner) {
                            gameStatus['text'] = "Finalizado";
                        } else {
                            gameStatus['text'] = "Cuarto " + game.localTeamInfo.quarterStats.length;
                        }
                    }
                }
                return {
                    _id: game._id,
                    competitionID: game.competitionID,
                    localTeamName: game.localTeamInfo.team.name,
                    visitorTeamName: game.visitorTeamInfo.team.name,
                    gameStatus: gameStatus,
                }
            });
            this.dataSource = new MatTableDataSource(this.gamesCompatible);
        }
    }

    goToGame(game) {
        this.router.navigate(["/competitions/" + game.competitionID + "/games/" + game._id]);
    }
}
