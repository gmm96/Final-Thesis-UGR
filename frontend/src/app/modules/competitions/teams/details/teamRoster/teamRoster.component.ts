import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-competition-team-roster',
    templateUrl: './teamRoster.component.html',
    styleUrls: ['./teamRoster.component.scss']
})
export class CompetitionTeamRosterComponent implements OnInit, OnDestroy {

    @Input('team') team;
    @Input('competitionID') competitionID;

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
