import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {PlayersService} from "../../../core/services/players/players.service";
import {TeamsService} from "../../../core/services/teams/teams.service";
import * as lodash from "lodash";
import {ToastrService} from "ngx-toastr";
import {CompetitionsService} from "../../../core/services/competitions/competitions.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-admin-competitions',
    templateUrl: './createCompetition.component.html',
    styleUrls: ['./createCompetition.component.scss'],
})
export class CreateCompetitionComponent implements OnInit, OnDestroy {

    competitionForm: FormGroup;
    @ViewChild('formDirective', {static: true}) formDirective: FormGroupDirective;
    filteredOptions: any = [];
    teamQueryToSearch: string;
    competitionTeams: Array<any> = [];


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private teamsService: TeamsService,
        private playersService: PlayersService,
        private competitionsService: CompetitionsService,
        private toastr: ToastrService,
        private changeDetectorRef: ChangeDetectorRef,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.competitionForm = this.fb.group({
            'name': [null, Validators.required],
            'organizer': [null, Validators.required],
            'season': [null, Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
            'class': [null, Validators.required],
            'sex': [null, Validators.required],
            'minTeamNumber': [null, Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
            'minPlayerNumberPerTeam': [null, Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
            'leagueFixturesVsSameTeam': [null, Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
            'playoffsFixturesVsSameTeam': [null, Validators.compose([Validators.required, Validators.pattern("^(\\d*[13579]|0)$")])],
        });
        this.titleService.setTitle("Creación de competiciones");
    }

    ngOnDestroy() {
    }

    canSendCompetition() {
        let formValid = this.competitionForm.valid;
        let teamNumber = this.competitionForm.value.minTeamNumber <= this.competitionTeams.length;
        let competitionFormat = this.competitionForm.value.leagueFixturesVsSameTeam || this.competitionForm.value.playoffsFixturesVsSameTeam;
        return formValid && teamNumber && competitionFormat;
    }

    async sendCompetition(event) {
        let competitionData = lodash.cloneDeep(this.competitionForm.value);
        competitionData.teams = this.competitionTeams.map(team => {
            return team._id
        });

        try {
            let newCompetition = (await this.competitionsService.createCompetition(competitionData));
            this.toastr.success("Competición con nombre " + newCompetition.name + " creado correctamente.", "Operación satisfactoria");
            this.resetCompetitionForm();
        } catch (e) {
            console.log(e);
            this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
        }
    }

    async searchTeamToAdd(event) {
        try {
            if (event.target.value) {
                this.filteredOptions = (await this.teamsService.getTeamArrayByName(event.target.value));
            } else {
                this.filteredOptions = [];
            }
        } catch (e) {
            console.log(e);
        }
    }

    addTeamToCompetition(event) {
        let teamToAdd = event.option.value;
        if (!this.competitionTeams.some(team => team.name == teamToAdd.name)) this.competitionTeams.push(teamToAdd);
        this.teamQueryToSearch = "";
        this.filteredOptions = [];
        this.changeDetectorRef.detectChanges();
    }

    addFirstFilteredOption(event) {
        event.preventDefault();
        if (this.filteredOptions.length && this.teamQueryToSearch.length) {
            event.option = {value: this.filteredOptions[0]};
            this.addTeamToCompetition(event);
        }
    }

    removeTeamFromList(name) {
        this.competitionTeams = this.competitionTeams.filter(team => {
            return team.name !== name;
        });
    }

    resetCompetitionForm() {
        this.formDirective.resetForm();
        this.competitionTeams = [];
    }

    public errorHandling = (control: string, error: string) => {
        if (this.competitionForm) return this.competitionForm.controls[control].hasError(error);
    }
}
