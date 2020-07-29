import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../shared/animations";
import {TeamsService} from "../../../core/services/teams/teams.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-team-details',
    templateUrl: './teamDetails.component.html',
    styleUrls: ['./teamDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class TeamDetailsComponent implements OnInit, OnDestroy {

    teamID: string;
    team: any;
    currentTabField: TeamDetailsTabs = TeamDetailsTabs.info;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private teamsService: TeamsService,
        private changeDetectorRef: ChangeDetectorRef,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.teamID = params['id'];
            this.team = (await this.teamsService.getTeamInformation(this.teamID));
            this.titleService.setTitle((this.team) ? this.team.name + " - Equipos" : "Equipos");
            if (this.team) {
                if (this.team.avatar) this.team.avatar = 'http://localhost:3000' + this.team.avatar;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openTeamInfo() {
        this.currentTabField = TeamDetailsTabs.info;
    }
    openTeamRoster() {
        this.currentTabField = TeamDetailsTabs.roster;
    }
    openCompetitions() {
        this.currentTabField = TeamDetailsTabs.competitions;
    }

    getTeamDetailsTabs () {
        return TeamDetailsTabs;
    }
};

export enum TeamDetailsTabs {
    info = "INFORMACIÓN",
    roster = "PLANTILLA",
    competitions = "COMPETICIONES",

}
