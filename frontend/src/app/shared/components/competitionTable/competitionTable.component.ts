import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-competition-table',
    templateUrl: './competitionTable.component.html',
    styleUrls: ['./competitionTable.component.scss']
})
export class CompetitionTableComponent implements OnInit, OnDestroy {

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
        this.displayedColumns = ['teamName', 'competitionName', 'season', 'category', 'sex'];
    }

    ngOnDestroy() {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

};

export interface CompetitionInterface {
    teamName: string;
    competitionName: string;
    season: number
    category: string;
    sex: string;
}

const ELEMENT_DATA: CompetitionInterface[] = [
    {teamName: "Tropics", competitionName: "XXV Liga de verano 2026", season: 2026, category: "Senior", sex:'M'},
    {teamName: "Tropics", competitionName: "XXV Competición Benefica Felipe Reyes", season: 2026, category: "Senior", sex:'M'},
    {teamName: "Tropics", competitionName: "XXV Liga de verano 2026", season: 2026, category: "Senior", sex:'M'}
];

