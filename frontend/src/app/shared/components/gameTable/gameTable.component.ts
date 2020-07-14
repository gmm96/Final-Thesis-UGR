import {Component, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-game-table',
    templateUrl: './gameTable.component.html',
    styleUrls: ['./gameTable.component.scss']
})
export class GameTableComponent implements OnInit, OnDestroy {

    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @Input() showPaginator: boolean = false;
    @Input() showCaption: boolean = true;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ['teamAName', 'gameStatus', 'teamBName'];
    }

    ngOnDestroy() {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}

export interface PeriodicElement {
    teamAName: string;
    gameStatus: string;
    teamBName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Valencia", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Baskonia"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Unicaja", gameStatus: '58-96', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"},
    {teamAName: "Barcelona", gameStatus: '65-98', teamBName: "Madrid"}
];


