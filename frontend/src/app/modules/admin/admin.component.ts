import {Component, OnDestroy, OnInit} from "@angular/core";
import {Animations} from "../../shared/animations";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    animations: [Animations.adminPanel, Animations.floatingSearchBox]
})
export class AdminComponent implements OnInit, OnDestroy {

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.titleService.setTitle("Administración");
    }

    ngOnDestroy() {
    }

    goToManagePlayers() {
        this.router.navigate(['/admin/players']);
    }

    goToManageTeams() {
        this.router.navigate(['/admin/teams'])
    }

    goToCreateCompetition() {
        this.router.navigate(['/admin/competitions']);
    }

    goToManageSchedule() {
        this.router.navigate(['/admin/schedule']);
    }
}
