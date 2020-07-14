import {Component, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-team-info',
    templateUrl: './teamInfo.component.html',
    styleUrls: ['./teamInfo.component.scss']
})
export class TeamInfoComponent implements OnInit, OnDestroy {

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

