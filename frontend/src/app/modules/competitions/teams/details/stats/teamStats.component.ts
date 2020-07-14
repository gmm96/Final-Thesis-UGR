import {Component, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-team-stats',
    templateUrl: './teamStats.component.html',
    styleUrls: ['./teamStats.component.scss']
})
export class TeamStatsComponent implements OnInit, OnDestroy {

    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.displayedColumns = ['name', 'value'];
    }

    ngOnDestroy() {
    }
}

export interface TeamStatsInterface {
    name: string;
    value: number;
}

const ELEMENT_DATA: TeamStatsInterface[] = [
    {name: "Partidos jugados", value: 24},
    {name: "Partidos ganados", value: 15},
    {name: "Partidos perdidos", value: 9},
    {name: "Puntos a favor", value: 750},
    {name: "Puntos en contra", value: 590},
    {name: "Diferencia de puntos", value: 160},
];

