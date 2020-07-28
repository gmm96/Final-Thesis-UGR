import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-playoffs-matchup',
    templateUrl: './playoffsMatchup.component.html',
    styleUrls: ['./playoffsMatchup.component.scss']
})
export class PlayoffsMatchupComponent implements OnInit, OnDestroy {

    @Input('games') games;
    displayedColumns: string[] = ['teamAName', 'gameStatus', 'teamBName'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
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
];


