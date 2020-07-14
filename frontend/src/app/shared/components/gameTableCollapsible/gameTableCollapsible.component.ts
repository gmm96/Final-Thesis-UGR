import {Component, OnDestroy, OnInit} from "@angular/core";
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
            state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('*', style({ height: '*', visibility: 'visible' })),
            transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class GameTableCollapsibleComponent implements OnInit, OnDestroy {
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    private openedRow: CdkDetailRowDirective;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.displayedColumns = ['teamAName', 'gameStatus', 'teamBName'];
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    }

    ngOnDestroy() {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    onToggleChange(cdkDetailRow: CdkDetailRowDirective) : void {
        if (this.openedRow && this.openedRow.expended) {
            this.openedRow.toggle();
        }
        this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
    }

}

export interface PeriodicElement {
    teamAName: string;
    gameStatus: string;
    teamBName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Valencia", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '3-0', teamBName: "Madrid"},
];
