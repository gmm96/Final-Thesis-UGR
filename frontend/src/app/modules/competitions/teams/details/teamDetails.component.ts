import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../../shared/animations";
import {Title} from "@angular/platform-browser";
import {CompetitionsService} from "../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-competition-team-details',
    templateUrl: './teamDetails.component.html',
    styleUrls: ['./teamDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionTeamDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    teamID: string;
    team: any;
    competition: any;
    currentTabField: TeamDetailsTabs;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private changeDetectorRef: ChangeDetectorRef,
        private competitionsService: CompetitionsService
    ) {
    }

    async ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.competitionID = params['competitionID'];
            this.teamID = params['teamID'];
            this.competition = (await this.competitionsService.getFullCompetitionInfo(this.competitionID));
            this.team = this.competition.teams.find(team => team._id.toString() === this.teamID.toString());
            if (!this.team) {
                this.router.navigate(["/notFound"]);
            }
            if (this.team.avatar) this.team.avatar = 'http://localhost:3000' + this.team.avatar;
            this.titleService.setTitle((this.team) ? this.team.name + " en " + this.competition.name + " - Equipo en competición" : "Equipos en competición");
            this.changeDetectorRef.detectChanges();
        });
        this.currentTabField = TeamDetailsTabs.roster;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openTeamRoster() {
        this.currentTabField = TeamDetailsTabs.roster;
    }

    openNextGames() {
        this.currentTabField = TeamDetailsTabs.nextGames;
    }

    openPrevGames() {
        this.currentTabField = TeamDetailsTabs.prevGames;
    }

    openTeamStats() {
        this.currentTabField = TeamDetailsTabs.stats;
    }

    goToTeamPage() {
        this.router.navigate(['/teams/' + this.teamID]);
    }

    goToCompetitionPage() {
        this.router.navigate(['/competitions/' + this.competitionID]);
    }


    getTeamDetailsTabs() {
        return TeamDetailsTabs;
    }
};

export enum TeamDetailsTabs {
    roster = "PLANTILLA",
    nextGames = 'PARTIDOS POST.',
    prevGames = 'PARTIDOS ANT.',
    stats = 'ESTADÍSTICAS'
}
