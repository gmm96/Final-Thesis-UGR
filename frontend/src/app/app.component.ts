import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'frontend';
    loaded: boolean = false;
    opened: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        setTimeout(() => this.setLoaded(), 3000);
    }

    setLoaded() {
        this.loaded = true;
    }

    navigateTo(route: string) {

        let competitionID = localStorage.getItem("competitionID");

        let newRoute = route.replace(":compId", competitionID)

        this.router.navigate([route]);
    }
};
