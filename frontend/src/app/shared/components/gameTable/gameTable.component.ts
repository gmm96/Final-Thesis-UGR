import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-game-table',
    templateUrl: './gameTable.component.html',
    styleUrls: ['./gameTable.component.scss']
})
export class GameTableComponent implements OnInit, OnDestroy {

    @Input('games') games;
    gameCompatible: any = [];
    minDate: string;
    maxDate: string;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @Input() showPaginator: boolean = false;
    @Input() showCaption: boolean = true;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.displayedColumns = ['localTeamName', 'gameStatus', 'visitorTeamName'];
    }

    ngOnDestroy() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setDataTable();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDataTable() {
        if (this.games && this.games.length) {
            this.gameCompatible = this.games.map(item => {
                return {
                    _id: item._id,
                    competitionID: item.competitionID,
                    localTeamName: item.localTeamInfo.team.name,
                    visitorTeamName: item.visitorTeamInfo.team.name,
                    // gameStatus: (item.winner == null) ? ((item.time) ? new Date(item.time).toLocaleDateString("es-ES") + " " + " algo" : "-") : "TODO",
                    gameStatus: {
                        date: (item.winner == null) ? ((item.time) ? new Date(item.time).toLocaleDateString("es-ES") : null) : null,
                        time: (item.winner == null) ? ((item.time) ? new Date(item.time).toLocaleTimeString("es-ES", {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : null) : null,
                        result: (item.winner == null) ? ((item.time) ? null : " - ") : "TODO",
                    },
                    fixture: item.fixture
                }
            });
            let maxDateNumber = Math.max.apply(Math, this.games.map((game) => new Date(game.time)));
            let minDateNumber = Math.min.apply(Math, this.games.map((game) => new Date(game.time)));
            this.maxDate = (maxDateNumber) ? new Date(maxDateNumber).toLocaleDateString("es-ES") : null;
            this.minDate = (minDateNumber) ? new Date(minDateNumber).toLocaleDateString("es-ES") : null;
            this.dataSource = new MatTableDataSource(this.gameCompatible);
            this.dataSource.paginator = this.paginator;
            this.changeDetectorRef.detectChanges();
        }
    }

    goToGame(game) {
        this.router.navigate(['/competitions/' + game.competitionID + '/games/' + game._id]);
    }
}
