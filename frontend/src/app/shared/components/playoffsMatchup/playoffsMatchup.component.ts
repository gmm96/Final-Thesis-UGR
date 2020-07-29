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
                return {
                    _id: game._id,
                    competitionID: game.competitionID,
                    localTeamName: game.localTeamInfo.team.name,
                    visitorTeamName: game.visitorTeamInfo.team.name,
                    gameStatus: " - ",
                }
            });
            this.dataSource = new MatTableDataSource(this.gamesCompatible);
        }
    }

    goToGame(game) {
        this.router.navigate(["/competitions/" + game.competitionID + "/game/" + game._id]);
    }
}
