import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CdkDetailRowDirective} from "./cdk-detail-row.directive";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-game-table-collapsible',
    templateUrl: './gameTableCollapsible.component.html',
    styleUrls: ['./gameTableCollapsible.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
            state('*', style({height: '*', visibility: 'visible'})),
            transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class GameTableCollapsibleComponent implements OnInit, OnDestroy {

    roundNumbers: Array<number>;
    @Input('rounds') rounds;
    roundsCompatible: any;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    private openedRow: CdkDetailRowDirective;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


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
        (await this.setTableData());
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    onToggleChange(cdkDetailRow: CdkDetailRowDirective): void {
        if (this.openedRow && this.openedRow.expended) {
            this.openedRow.toggle();
        }
        this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
    }

    setTableData() {
        if (this.rounds) {
            this.roundsCompatible = this.rounds.teams.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    city: item.city,
                    playersLength: (item.players && item.players.length)? item.players.length : 0,
                    avatar: item.avatar? "http://localhost:3000" + item.avatar : null
                }
            });
            this.dataSource = new MatTableDataSource(this.roundsCompatible);
            this.dataSource.paginator = this.paginator;
        }

    }

    getRoundText(round: number) {
        if (round) {
            return RoundText[round];
        }
    }
};


const RoundText = {
    1: "Final",
    2: "Semifinal",
    4: "Cuartos de final",
    8: "Octavos de final",
    16: "Dieciseisavos de final",
    32: "Treintaidosavos de final",
    64: "Sesentaicuatroavos de final",
};

