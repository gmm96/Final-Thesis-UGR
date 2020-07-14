import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-team-roster',
    templateUrl: './teamRoster.component.html',
    styleUrls: ['./teamRoster.component.scss']
})
export class TeamRosterComponent implements OnInit, OnDestroy {

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
