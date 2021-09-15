import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";

@Component({
    selector: 'app-team-roster',
    templateUrl: './teamRoster.component.html',
    styleUrls: ['./teamRoster.component.scss']
})
export class TeamRosterComponent implements OnInit, OnDestroy {

    @Input('teamRoster') teamRoster: any;

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
