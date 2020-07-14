import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-team-competitions',
    templateUrl: './teamCompetitions.component.html',
    styleUrls: ['./teamCompetitions.component.scss']
})
export class TeamCompetitionsComponent implements OnInit, OnDestroy {

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
