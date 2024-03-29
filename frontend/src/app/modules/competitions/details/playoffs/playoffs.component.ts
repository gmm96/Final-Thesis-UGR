import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompetitionsService} from "../../../../core/services/competitions/competitions.service";

@Component({
    selector: 'app-playoffs',
    templateUrl: './playoffs.component.html',
    styleUrls: ['./playoffs.component.scss'],
})
export class PlayoffsComponent implements OnInit, OnDestroy {

    @Input('competition') competition;
    playoffsRounds: any;
    objectKeys = Object.keys;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionsService: CompetitionsService,
    ) {
    }

    async ngOnInit() {
        try {
            this.playoffsRounds = (await this.competitionsService.getAllAvailablePlayoffsRoundsByCompetition(this.competition._id));
        } catch (e) {
            console.error(e)
        }
    }

    ngOnDestroy() {
    }

}

