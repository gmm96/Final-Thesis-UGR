import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {PlayersService} from "../../../core/services/players/players.service";
import {TeamsService} from "../../../core/services/teams/teams.service";
import * as lodash from "lodash";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-admin-teams',
    templateUrl: './manageTeams.component.html',
    styleUrls: ['./manageTeams.component.scss'],
})
export class ManageTeamsComponent implements OnInit, OnDestroy {

    optionForm: FormGroup
    teamForm: FormGroup
    @ViewChild('formDirective', {static: true}) formDirective: FormGroupDirective;
    deleteAvatarSub: Subscription;
    setTeamToEditSub: Subscription;
    createEditSub: Subscription;
    filteredOptions: any;
    filteredOptionsPlayers: any;
    selectedTeamToEdit: any;
    playerQueryToSearch: string;
    teamPlayers: Array<any> = [];


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private teamsService: TeamsService,
        private playersService: PlayersService,
        private toastr: ToastrService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.optionForm = this.fb.group({
            'action': [null, Validators.required],
            'name': [null]
        });
        this.teamForm = this.fb.group({
            'name': [null, Validators.required],
            'city': [null, Validators.required],
            'address': [null, Validators.required],
            'localJersey': [null, Validators.required],
            'visitorJersey': [null, Validators.required],
            'avatar': [null],
            'deleteAvatar': [false],
        });
        this.deleteAvatarSub = this.teamForm.get("deleteAvatar").valueChanges.subscribe(value => {
            if (value) {
                this.teamForm.controls['avatar'].reset();
            }
        })
        this.setTeamToEditSub = this.optionForm.get("name").valueChanges.subscribe(value => {
            this.setFilteredTeams(value);
        })
        this.createEditSub = this.optionForm.get("action").valueChanges.subscribe(value => {
            this.clearTeamToEdit();
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.deleteAvatarSub.unsubscribe();
        this.setTeamToEditSub.unsubscribe();
        this.createEditSub.unsubscribe();
    }

    canEditOptionSearchBox() {
        return this.optionForm.controls['action'].value == ManageTeamActions.edit;
    }

    cannotUploadImage() {
        return this.canEditOptionSearchBox() && (this.teamForm.controls['deleteAvatar'].value || !this.selectedTeamToEdit);
    }

    async sendTeam(event) {
        let teamData = lodash.cloneDeep(this.teamForm.value);
        delete teamData.avatar;
        teamData.players = this.teamPlayers.map( player => {
            return player._id
        });
        let avatar = (this.teamForm.value.avatar) ? this.teamForm.value.avatar.files[0] : null;

        if (!this.canEditOptionSearchBox()) {
            try {
                // let newTeam = (await this.teamsService.createTeam(teamData, avatar));
                // this.toastr.success("Equipo con nombre " + newTeam.name + " creado correctamente.", "Operación satisfactoria");
                this.resetTeamForm();
            } catch (e) {
                this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
            }
        } else {
            try {
                let editedTeam = (await this.teamsService.editTeam(this.selectedTeamToEdit._id, teamData, avatar));
                this.toastr.success("Equipo con nombre " + editedTeam.name + " editado correctamente.", "Operación satisfactoria");
                this.clearTeamToEdit();
            } catch (e) {
                this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
            }
        }
    }


    async deleteTeam() {
        try {
            let resultConfirm = confirm("¿ Realmente desea borrar el equipo con nombre '" + this.selectedTeamToEdit.name + "' ?")
            if (resultConfirm) {
                // let result = (await this.teamsService.deleteTeam(this.selectedTeamToEdit._id));
                this.toastr.success("Equipo con nombre '" + this.selectedTeamToEdit.name + "' borrado correctamente.", "Operación satisfactoria");
                this.clearTeamToEdit();
            }
        } catch (e) {
            this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
        }

    }

    async setFilteredTeams(query: string) {
        try {
            if (query) this.filteredOptions = (await this.teamsService.getTeamArrayByName(query));
        } catch (e) {
            console.log(e);
        }
    }

    async searchPlayerToAdd(event) {
        try {
            // if (event.target.value) this.filteredOptions = (await this.playersService.getPlayerArrayByPersonalIdentification(event.target.value));
        } catch (e) {
            console.log(e);
        }
    }

    setTeamToEdit(event) {
        this.selectedTeamToEdit = event.option.value;
        this.optionForm.controls["name"].setValue(this.selectedTeamToEdit.name + " ( " + this.selectedTeamToEdit.city + " )");

        this.teamForm.controls['name'].setValue(this.selectedTeamToEdit.name);
        this.teamForm.controls['city'].setValue(this.selectedTeamToEdit.city);
        this.teamForm.controls['address'].setValue(this.selectedTeamToEdit.address);
        this.teamForm.controls['localJersey'].setValue(this.selectedTeamToEdit.localJersey);
        this.teamForm.controls['visitorJersey'].setValue(this.selectedTeamToEdit.visitorJersey);
        this.teamForm.controls['deleteAvatar'].setValue(false);
        this.teamPlayers = this.selectedTeamToEdit.players;
    }

    addPlayerToTeam(event) {

    }

    clearTeamToEdit() {
        this.optionForm.controls["name"].reset();
        this.selectedTeamToEdit = null;
        this.resetTeamForm();
        this.changeDetectorRef.detectChanges();
    }

    resetTeamForm() {
        this.formDirective.resetForm();
        this.teamPlayers = [];
    }

    public errorHandling = (control: string, error: string) => {
        if (this.teamForm) return this.teamForm.controls[control].hasError(error);
    }

    getManageTeamActions() {
        return ManageTeamActions;
    }
}


export enum ManageTeamActions {
    create = "CREAR",
    edit = "EDITAR",
}
