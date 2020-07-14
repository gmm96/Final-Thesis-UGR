import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-player-table',
    templateUrl: './playerTable.component.html',
    styleUrls: ['./playerTable.component.scss']
})
export class PlayerTableComponent implements OnInit, OnDestroy {

    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ['playerName', 'playerAge', 'playerHeight', 'playerWeight'];
    }

    ngOnDestroy() {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

};

export interface PlayerInterface {
    playerName: string;
    playerAge: number;
    playerHeight: number
    playerWeight: number;
    playerImg: string;
}

const ELEMENT_DATA: PlayerInterface[] = [
    {playerName: "Montes Martos, Francisco Javier", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "Montes Martos, Guillermo", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "De los Ríos Ramon y Cajal, Agustín", playerAge: 25, playerHeight: 1.44, playerWeight: 62, playerImg:''},
    {playerName: "Montes Martos, Francisco Javier", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "Montes Martos, Guillermo", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "De los Ríos Ramon y Cajal, Agustín", playerAge: 25, playerHeight: 1.44, playerWeight: 62, playerImg:''},
    {playerName: "Montes Martos, Francisco Javier", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "Montes Martos, Guillermo", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "De los Ríos Ramon y Cajal, Agustín", playerAge: 25, playerHeight: 1.44, playerWeight: 62, playerImg:''},
    {playerName: "Montes Martos, Francisco Javier", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "Montes Martos, Guillermo", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "De los Ríos Ramon y Cajal, Agustín", playerAge: 25, playerHeight: 1.44, playerWeight: 62, playerImg:''},
    {playerName: "Montes Martos, Francisco Javier", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "Montes Martos, Guillermo", playerAge: 24, playerHeight: 1.84, playerWeight: 82, playerImg:''},
    {playerName: "De los Ríos Ramon y Cajal, Agustín", playerAge: 25, playerHeight: 1.44, playerWeight: 62, playerImg:''},
];

