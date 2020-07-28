import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompetitionsService} from "../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

    @Input('competition') competition;
    fixtureNumber: number;
    maxFixture: number;
    games = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {
        this.maxFixture = (this.competition) ? (this.competition.teams.length - 1) * this.competition.leagueFixturesVsSameTeam : 0;
        try {
            this.fixtureNumber = JSON.parse(await this.competitionsService.getCurrentFixture(this.competition._id));
            this.games = (await this.competitionsService.getGameByCompetitionAndFixture(this.competition._id, this.fixtureNumber));
        } catch (e) {
            console.error(e);
        }
    }

    ngOnDestroy() {
    }

    async goToPrevFixture() {
        if (this.fixtureNumber != 1) {
            this.fixtureNumber -= 1;
            (await this.setGames());
        }
    }

    async gotoNextFixture() {
        if (this.fixtureNumber != this.maxFixture) {
            this.fixtureNumber += 1;
            (await this.setGames());
        }
    }

    async setGames() {
        if (this.competition && this.fixtureNumber) {
            this.games = (await this.competitionsService.getGameByCompetitionAndFixture(this.competition._id, this.fixtureNumber));
            this.changeDetectorRef.detectChanges();
        }
    }


    async onFixtureChange(event) {
        (await this.setGames());
    }

}
