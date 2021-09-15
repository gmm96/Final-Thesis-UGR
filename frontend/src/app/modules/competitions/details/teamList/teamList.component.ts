import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";

@Component({
    selector: 'app-team-list',
    templateUrl: './teamList.component.html',
    styleUrls: ['./teamList.component.scss']
})
export class TeamListComponent implements OnInit, OnDestroy {

    @Input('competition') competition: any;

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
