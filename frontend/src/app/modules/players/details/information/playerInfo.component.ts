import {Component, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-player-info',
    templateUrl: './playerInfo.component.html',
    styleUrls: ['./playerInfo.component.scss']
})
export class PlayerInfoComponent implements OnInit, OnDestroy {

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

