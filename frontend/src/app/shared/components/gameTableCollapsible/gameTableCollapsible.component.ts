import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CdkDetailRowDirective} from "./cdk-detail-row.directive";

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

    @Input('rounds') rounds;
    roundsCompatible: any = {};
    displayedColumns: string[];
    dataSource: any = {};
    private openedRow: CdkDetailRowDirective;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.displayedColumns = ['localTeamName', 'roundStatus', 'visitorTeamName'];
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        (await this.setTableData());
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        Object.keys(this.dataSource).forEach(index => {
            this.dataSource[index].filter = filterValue;
        })
    }

    onToggleChange(cdkDetailRow: CdkDetailRowDirective): void {
        if (this.openedRow && this.openedRow.expended) {
            this.openedRow.toggle();
        }
        this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
    }

    setTableData() {
        if (this.rounds) {
            for (let roundGroupedIndex in this.rounds) {
                let playoffsRounds = this.rounds[roundGroupedIndex];
                this.roundsCompatible[roundGroupedIndex] = playoffsRounds.map(round => {
                    let localWins = 0;
                    let visitorWins = 0;
                    round.games.forEach(game => {
                        if (game.winner) {
                            if (game.winner.toString() === round.localTeamID.toString())
                                localWins += 1;
                            else
                                visitorWins += 1;
                        }
                    });
                    return {
                        localTeamName: round.localTeam.name,
                        visitorTeamName: round.visitorTeam.name,
                        games: round.games,
                        roundStatus: localWins + " - " + visitorWins,
                    }
                });
                this.dataSource[roundGroupedIndex] = new MatTableDataSource(this.roundsCompatible[roundGroupedIndex]);
            }
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

