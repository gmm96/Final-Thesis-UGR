import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../../../shared/animations";
import {CompetitionsService} from "../../../../../core/services/competitions/competitions.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-competition-player-details',
    templateUrl: './playerDetails.component.html',
    styleUrls: ['./playerDetails.component.scss'],
    animations: [Animations.animatedTabs, Animations.avoidAnimatedTabsFirstEvent]
})
export class CompetitionPlayerDetailsComponent implements OnInit, OnDestroy {

    competitionID: string;
    competition: any;
    teamID: string;
    team: any;
    playerID: string;
    player: any;
    currentTabField: TeamDetailsTabs = TeamDetailsTabs.nextGames;
    private sub: Subscription;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService,
        private titleService: Title,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    async ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.competitionID = params['competitionID'];
            this.teamID = params['teamID'];
            this.playerID = params['playerID'];
            this.competition = (await this.competitionsService.getFullCompetitionInfo(this.competitionID));
            this.team = this.competition.teams.find(team => team._id.toString() === this.teamID.toString());
            if (!this.team) {
                this.router.navigate(["/notFound"]);
            }
            this.player = this.team.players.find(player => player._id.toString() === this.playerID.toString());
            if (!this.player) {
                this.router.navigate(["/notFound"]);
            }
            if (this.player.avatar) this.player.avatar = 'http://localhost:3000' + this.player.avatar;
            this.titleService.setTitle((this.player) ? this.player.name + " " + this.player.surname + " en " + this.competition.name + " - Jugador en competición" : "Jugadores en competición");
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
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
        this.router.navigate(['/competitions/' + this.competitionID + '/teams/' + this.teamID]);
    }

    goToPlayerPage() {
        this.router.navigate(['/players/' + this.playerID]);
    }


    getTeamDetailsTabs() {
        return TeamDetailsTabs;
    }
};

export enum TeamDetailsTabs {
    nextGames = 'PARTIDOS POST.',
    prevGames = 'PARTIDOS ANT.',
    stats = 'ESTADÍSTICAS'
}
