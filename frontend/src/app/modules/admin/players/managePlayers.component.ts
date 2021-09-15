import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {PlayersService} from "../../../core/services/players/players.service";
import * as lodash from 'lodash';
import {ToastrService} from "ngx-toastr";
import 'moment/locale/es';
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-admin-players',
    templateUrl: './managePlayers.component.html',
    styleUrls: ['./managePlayers.component.scss'],
})
export class ManagePlayersComponent implements OnInit, OnDestroy {

    optionForm: FormGroup
    playerForm: FormGroup
    @ViewChild('formDirective', {static: true}) formDirective: FormGroupDirective;
    deleteAvatarSub: Subscription;
    setPlayerToEditSub: Subscription;
    createEditSub: Subscription;
    filteredOptions: any;
    selectedPlayerToEdit: any;
    maxDate = new Date();


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private playersService: PlayersService,
        private toastr: ToastrService,
        private changeDetectorRef: ChangeDetectorRef,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.optionForm = this.fb.group({
            'action': [null, Validators.required],
            'idCard': [null]
        });
        this.playerForm = this.fb.group({
            'name': [null, Validators.required],
            'surname': [null, Validators.required],
            'idCard': [null, Validators.compose([Validators.required, Validators.pattern("[0-9]{8}[A-Za-z]{1}")])],
            'birthDate': [null, Validators.required],
            'birthPlace': [null, Validators.required],
            'height': [null, Validators.compose([Validators.required, Validators.pattern("\\d+([.]\\d+)?")])],
            'weight': [null, Validators.compose([Validators.required, Validators.pattern("\\d+([.]\\d+)?")])],
            'avatar': [null],
            'deleteAvatar': [false],
        });
        this.deleteAvatarSub = this.playerForm.get("deleteAvatar").valueChanges.subscribe(value => {
            if (value) {
                this.playerForm.controls['avatar'].reset();
            }
        })
        this.setPlayerToEditSub = this.optionForm.get("idCard").valueChanges.subscribe(value => {
            this.setFilteredPlayers(value);
        })
        this.createEditSub = this.optionForm.get("action").valueChanges.subscribe(value => {
            this.clearPlayerToEdit();
            this.changeDetectorRef.detectChanges();
        });
        this.titleService.setTitle("Gestión de jugadores");
    }

    ngOnDestroy() {
        this.deleteAvatarSub.unsubscribe();
        this.setPlayerToEditSub.unsubscribe();
        this.createEditSub.unsubscribe();
    }

    canEditOptionSearchBox() {
        return this.optionForm.controls['action'].value == ManagePlayerActions.edit;
    }

    cannotUploadImage() {
        return this.canEditOptionSearchBox() && (this.playerForm.controls['deleteAvatar'].value || !this.selectedPlayerToEdit);
    }

    async sendPlayer(event) {
        let playerData = lodash.cloneDeep(this.playerForm.value);
        playerData.height = parseFloat(playerData.height);
        playerData.weight = parseFloat(playerData.weight);
        delete playerData.avatar;
        let avatar = (this.playerForm.value.avatar) ? this.playerForm.value.avatar.files[0] : null;

        if (!this.canEditOptionSearchBox()) {
            try {
                let newPlayer = (await this.playersService.createPlayer(playerData, avatar));
                this.toastr.success("Jugador con identificación personal '" + newPlayer.idCard + "' creado correctamente.", "Operación satisfactoria");
                this.resetPlayerForm();
            } catch (e) {
                this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
            }
        } else {
            try {
                let editedPlayer = (await this.playersService.editPlayer(this.selectedPlayerToEdit._id, playerData, avatar));
                this.toastr.success("Jugador con identificación personal '" + editedPlayer.idCard + "' editado correctamente.", "Operación satisfactoria");
                this.clearPlayerToEdit();
            } catch (e) {
                this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
            }
        }
    }


    async deletePlayer() {
        try {
            let resultConfirm = confirm("¿ Realmente desea borrar el jugador con identificación personal '" + this.selectedPlayerToEdit.idCard + "' ?")
            if (resultConfirm) {
                let result = (await this.playersService.deletePlayer(this.selectedPlayerToEdit._id));
                this.toastr.success("Jugador con identificación personal '" + this.selectedPlayerToEdit.idCard + "' borrado correctamente.", "Operación satisfactoria");
                this.clearPlayerToEdit();
            }
        } catch (e) {
            this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
        }
    }

    async setFilteredPlayers(query: string) {
        try {
            if (query) this.filteredOptions = (await this.playersService.getPlayerArrayByPersonalIdentification(query));
        } catch (e) {
            console.log(e);
        }
    }

    setPlayerToEdit(event) {
        this.selectedPlayerToEdit = event.option.value;
        this.optionForm.controls["idCard"].setValue(this.selectedPlayerToEdit.idCard + " ( " +
            this.selectedPlayerToEdit.name + " " + this.selectedPlayerToEdit.surname + " ) ");

        this.playerForm.controls['name'].setValue(this.selectedPlayerToEdit.name);
        this.playerForm.controls['surname'].setValue(this.selectedPlayerToEdit.surname);
        this.playerForm.controls['idCard'].setValue(this.selectedPlayerToEdit.idCard);
        this.playerForm.controls['birthDate'].setValue(this.selectedPlayerToEdit.birthDate);
        this.playerForm.controls['birthPlace'].setValue(this.selectedPlayerToEdit.birthPlace);
        this.playerForm.controls['height'].setValue(this.selectedPlayerToEdit.height);
        this.playerForm.controls['weight'].setValue(this.selectedPlayerToEdit.weight);
        this.playerForm.controls['deleteAvatar'].setValue(false);
    }

    addFirstFilteredOption(event) {
        event.preventDefault();
        if (this.filteredOptions.length && this.optionForm.value.idCard && this.optionForm.value.idCard.length) {
            event.option = {value: this.filteredOptions[0]};
            this.setPlayerToEdit(event);
        }
    }

    clearPlayerToEdit() {
        this.optionForm.controls["idCard"].reset();
        this.selectedPlayerToEdit = null;
        this.resetPlayerForm();
        this.changeDetectorRef.detectChanges();
    }

    resetPlayerForm() {
        this.formDirective.resetForm();
    }

    setDateFormat() {
        if (this.playerForm.value.birthDate) this.playerForm.get('birthDate').setValue(this.playerForm.value.birthDate.toISOString());
    }

    public errorHandling = (control: string, error: string) => {
        if (this.playerForm) return this.playerForm.controls[control].hasError(error);
    }

    getManagePlayerActions() {
        return ManagePlayerActions;
    }
}


export enum ManagePlayerActions {
    create = "CREAR",
    edit = "EDITAR",
}
