import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TeamsService} from "../../../../core/services/teams/teams.service";

@Component({
    selector: 'app-team-competitions',
    templateUrl: './teamCompetitions.component.html',
    styleUrls: ['./teamCompetitions.component.scss']
})
export class TeamCompetitionsComponent implements OnInit, OnDestroy {

    @Input('teamID') teamID: any;
    competitions: Array<any> = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private teamsService: TeamsService
    ) {
    }

    async ngOnInit() {
        this.getTeamCompetitions();
    }

    ngOnDestroy() {
    }

    async ngOnChanges(changes: SimpleChanges) {
        this.getTeamCompetitions();
    }


    async getTeamCompetitions() {
        if (this.teamID) {
            try {
                this.competitions = (await this.teamsService.getTeamCompetitions(this.teamID));
            } catch (e) {
                console.error(e);
            }
        }
    }
}
