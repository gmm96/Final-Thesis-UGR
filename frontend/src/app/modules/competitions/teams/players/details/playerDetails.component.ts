import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Animations} from "../../../../../shared/animations";
import {CompetitionsService} from "../../../../../core/services/competitions/competitions.service";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../../../../environments/environment";

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
    currentTabField: PlayerDetailsTabs;
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
            if (this.player.avatar) this.player.avatar = environment.backendURL + this.player.avatar;
            this.titleService.setTitle((this.player) ? this.player.name + " " + this.player.surname + " en " + this.competition.name + " - Jugador en competición" : "Jugadores en competición");
            this.changeDetectorRef.detectChanges();
        });
        this.currentTabField = PlayerDetailsTabs.nextGames;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openNextGames() {
        this.currentTabField = PlayerDetailsTabs.nextGames;
    }

    openPrevGames() {
        this.currentTabField = PlayerDetailsTabs.prevGames;
    }

    openPlayerStats() {
        this.currentTabField = PlayerDetailsTabs.stats;
    }

    goToTeamPage() {
        this.router.navigate(['/competitions/' + this.competitionID + '/teams/' + this.teamID]);
    }

    goToPlayerPage() {
        this.router.navigate(['/players/' + this.playerID]);
    }


    getPlayerDetailsTabs() {
        return PlayerDetailsTabs;
    }
};

export enum PlayerDetailsTabs {
    nextGames = 'PARTIDOS POSTERIORES.',
    prevGames = 'PARTIDOS ANTERIORES.',
    stats = 'ESTADÍSTICAS'
}
