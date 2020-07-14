import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-league-table',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit, OnDestroy, AfterViewInit {

    displayedColumns: string[] = ['position', 'team', 'played', 'wins', 'losses', 'total_points', 'total_opponent_points', 'difference'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit (){

        this.dataSource.sort = this.sort;
    }

}

export interface PeriodicElement {
    team: string;
    position: number;
    played: number;
    wins: number;
    losses: number;
    total_points: number;
    total_opponent_points: number;
    difference: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 2, team: 'Hydrogen', played: 5, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 3, team: 'Hydrogen', played: 6, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 4, team: 'Hydrogen', played: 10, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 5, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 6, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 7, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 8, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 9, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
    {position: 10, team: 'Hydrogen', played: 4, wins: 3, losses: 1, total_points: 90, total_opponent_points: 80, difference: 10},
];


