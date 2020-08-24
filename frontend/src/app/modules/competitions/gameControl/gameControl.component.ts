import {ChangeDetectorRef, Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {Animations} from "../../../shared/animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {CompetitionsService} from "../../../core/services/competitions/competitions.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../core/auth/auth.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-game-control',
    templateUrl: './gameControl.component.html',
    styleUrls: ['./gameControl.component.scss'],
    animations: [Animations.bottomSheet, Animations.simpleFade],
})

export class GameControlComponent implements OnInit {

    sub: Subscription;
    windowScrolled: boolean;
    windowScrolledMaxValue: number = 200;
    windowScrolledMinValue: number = 10;
    openedBottomSheet: boolean = false;
    canCloseBottomSheet: boolean = false;
    static timeoutSeconds: number = 60;
    timeoutRemainingSeconds: number = 0;
    possibleMinutes: Array<number>;
    interval;
    basketFormGroup: FormGroup;
    freeThrowFormGroup: FormGroup;
    foulFormGroup: FormGroup;
    timeoutFormGroup: FormGroup;
    lastKnownMinute: number;
    currentQuarter: number;
    competitionID: any;
    gameID: any;
    game: any;
    competition: any;
    localTeamPlayersForm: FormGroup;
    visitorTeamPlayersForm: FormGroup;
    refereesForm: FormGroup;
    localPlayers;
    visitorPlayers;
    localTeam: any;
    visitorTeam: any;
    modalPlayers: any;

    constructor(
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
        private changeDetectorRef: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private competitionsService: CompetitionsService,
        private toastr: ToastrService,
        private loginService: AuthService,
        private titleService: Title
    ) {
    }

    async ngOnInit() {
        this.localTeamPlayersForm = new FormGroup({});
        this.visitorTeamPlayersForm = new FormGroup({});

        this.sub = this.activatedRoute.params.subscribe(async params => {
            this.competitionID = params['competitionID'];
            this.gameID = params['gameID'];
            this.competition = (await this.competitionsService.getFullCompetitionInfo(this.competitionID));
            (await this.getGame());
            this.titleService.setTitle( this.game.localTeamInfo.team.name + " - " + this.game.visitorTeamInfo.team.name + " | " + this.competition.name );
        });

        this.windowScrolled = false;

        this.basketFormGroup = new FormGroup({
            team: new FormControl('', [Validators.required]),
            player: new FormControl('', [Validators.required]),
            points: new FormControl('', [Validators.required]),
            minute: new FormControl('', [Validators.required]),
        });

        this.freeThrowFormGroup = new FormGroup({
            team: new FormControl('', [Validators.required]),
            player: new FormControl('', [Validators.required]),
            in: new FormControl('', [Validators.required]),
            minute: new FormControl('', [Validators.required]),
        });

        this.foulFormGroup = new FormGroup({
            team: new FormControl('', [Validators.required]),
            player: new FormControl('', [Validators.required]),
            foulType: new FormControl('', [Validators.required]),
            minute: new FormControl('', [Validators.required]),
        });

        this.timeoutFormGroup = new FormGroup({
            team: new FormControl('', [Validators.required]),
            minute: new FormControl('', [Validators.required]),
        });
        this.refereesForm = new FormGroup({
            referee1: new FormControl(null, [Validators.required]),
            referee2: new FormControl(null),
            referee3: new FormControl(null),
        });
        this.changeDetectorRef.detectChanges();
    }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if ([window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop].some((value) => value > this.windowScrolledMaxValue)) {
            this.windowScrolled = true;
        } else if (this.windowScrolled && [window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop].some((value) => value < this.windowScrolledMinValue)) {
            this.windowScrolled = false;
        }
    }

    async getGame() {
        this.game = (await this.competitionsService.getFullGameById(this.competitionID, this.gameID));
        this.localTeam = this.game.localTeamInfo.team;
        this.visitorTeam = this.game.visitorTeamInfo.team;
        if (this.localTeam.avatar) this.localTeam.avatar = 'http://localhost:3000' + this.localTeam.avatar;
        if (this.visitorTeam.avatar) this.visitorTeam.avatar = 'http://localhost:3000' + this.visitorTeam.avatar;
        if (this.game.time) this.game.time = new Date(this.game.time).toLocaleString().slice(0, -3);;

        if (!this.isGameStarted()) {
            this.localTeam.players.forEach((player) => {
                this.localTeamPlayersForm.addControl(player._id.toString() + "_selected", new FormControl(null));
                this.localTeamPlayersForm.addControl(player._id.toString() + "_number", new FormControl(null));
                this.localTeamPlayersForm.addControl(player._id.toString() + "_startingLineup", new FormControl(null));
            });
            this.visitorTeam.players.forEach((player) => {
                this.visitorTeamPlayersForm.addControl(player._id.toString() + "_selected", new FormControl(null));
                this.visitorTeamPlayersForm.addControl(player._id.toString() + "_number", new FormControl(null));
                this.visitorTeamPlayersForm.addControl(player._id.toString() + "_startingLineup", new FormControl(null));
            });
            this.localPlayers = this.localTeam.players;
            this.visitorPlayers = this.visitorTeam.players;
        } else {
            this.localPlayers = [];
            this.visitorPlayers = [];
            this.game.localTeamInfo.playerStats.forEach(playerGameStats => {
                let player = this.localTeam.players.find(player => player._id.toString() === playerGameStats.playerID.toString());
                this.localPlayers.push({...player, stats: playerGameStats});
            });
            this.game.visitorTeamInfo.playerStats.forEach(playerGameStats => {
                let player = this.visitorTeam.players.find(player => player._id.toString() === playerGameStats.playerID.toString());
                this.visitorPlayers.push({...player, stats: playerGameStats});
            });
            this.currentQuarter = this.game.events[0].quarter;
            if (this.currentQuarter <= 4) {
                this.possibleMinutes = Array.from(Array((10)), (v, i) => i + (this.currentQuarter - 1) * 10 + 1);
            } else {
                this.possibleMinutes = Array.from(Array((5)), (v, i) => i + 40 + 1 + (this.currentQuarter - 4 - 1) * 5);
            }
            this.updateMinute(this.game.events[0].minute);
        }
        await this.resetForm(this.basketFormGroup);
        this.resetForm(this.freeThrowFormGroup);
        this.resetForm(this.timeoutFormGroup);
        this.resetForm(this.foulFormGroup);
        this.changeDetectorRef.detectChanges();
    }

    closeBottomSheet() {
        this.canCloseBottomSheet = true;
        this.openedBottomSheet = false;
        setTimeout(() => this.canCloseBottomSheet = false, 300);
    }

    async resetForm(formGroup) {
        await formGroup.reset();
    }

    async sendEvent(event) {
        try {
            (await this.competitionsService.createGameEvent(this.competitionID, this.gameID, event));
            this.toastr.success("Evento creado correctamente.", "Operación satisfactoria");
            (await this.getGame());
        } catch (e) {
            this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
        }
    }

    async removeEvent(eventID) {
        try {
            (await this.competitionsService.removeGameEvent(this.competitionID, this.gameID, eventID));
            this.toastr.success("Evento borrado correctamente.", "Operación satisfactoria");
            (await this.getGame());
        } catch (e) {
            this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
        }
    }

    async callForTimeout() {
        let event = {
            competitionID: this.competitionID,
            gameID: this.gameID,
            teamID: this.timeoutFormGroup.get('team').value,
            type: 'timeOut',
            minute: this.timeoutFormGroup.get('minute').value,
            quarter: this.currentQuarter
        };
        this.updateMinute(event.minute);
        (await this.sendEvent(event));
        setTimeout(() => this.resetForm(this.timeoutFormGroup), 0);
        this.timeoutRemainingSeconds = GameControlComponent.timeoutSeconds;
        this.interval = setInterval(() => {
            if (this.timeoutRemainingSeconds > 0) this.timeoutRemainingSeconds--;
            this.changeDetectorRef.detectChanges();
        }, 1000);

    }

    async callForAFoul() {
        let event = {
            competitionID: this.competitionID,
            gameID: this.gameID,
            teamID: this.foulFormGroup.get('team').value,
            playerID: this.foulFormGroup.get('player').value,
            type: 'foul',
            data: this.foulFormGroup.get('foulType').value,
            minute: this.foulFormGroup.get('minute').value,
            quarter: this.currentQuarter
        };
        this.updateMinute(event.minute);
        setTimeout(() => this.resetForm(this.foulFormGroup), 0);
        (await this.sendEvent(event));
    }

    async annotateFreeThrow() {
        let event = {
            competitionID: this.competitionID,
            gameID: this.gameID,
            teamID: this.freeThrowFormGroup.get('team').value,
            playerID: this.freeThrowFormGroup.get('player').value,
            type: 'freeThrow',
            data: this.freeThrowFormGroup.get('in').value,
            minute: this.freeThrowFormGroup.get('minute').value,
            quarter: this.currentQuarter
        };
        this.updateMinute(event.minute);
        setTimeout(() => this.resetForm(this.freeThrowFormGroup), 0);
        (await this.sendEvent(event));
    }

    async annotateBasket() {
        let event = {
            competitionID: this.competitionID,
            gameID: this.gameID,
            teamID: this.basketFormGroup.get('team').value,
            playerID: this.basketFormGroup.get('player').value,
            type: 'basket',
            data: this.basketFormGroup.get('points').value,
            minute: this.basketFormGroup.get('minute').value,
            quarter: this.currentQuarter
        };
        this.updateMinute(event.minute);
        setTimeout(() => this.resetForm(this.basketFormGroup), 0);
        (await this.sendEvent(event));
    }

    async goToNextQuarter() {
        this.closeBottomSheet();
        if (confirm('̣̣̣¿Desea finalizar el cuarto actual? No podrá deshacer esta acción. ')) {
            let event = {
                competitionID: this.competitionID,
                gameID: this.gameID,
                type: 'endQuarter',
                quarter: this.currentQuarter
            };
            this.updateMinute(event.quarter * 10);
            setTimeout(() => this.resetForm(this.basketFormGroup), 0);
            (await this.sendEvent(event));
        }
    }

    isGameStarted(): boolean {
        if (this.game) {
            let localTeamInfo = this.game.localTeamInfo;
            let visitorTeamInfo = this.game.visitorTeamInfo;
            let localOk = localTeamInfo.playerStats && localTeamInfo.playerStats.length && localTeamInfo.quarterStats && localTeamInfo.quarterStats.length;
            let visitorOk = visitorTeamInfo.playerStats && visitorTeamInfo.playerStats.length && visitorTeamInfo.quarterStats && visitorTeamInfo.quarterStats.length;
            return localOk && visitorOk;
        } else {
            return false;
        }
    }

    async startGame() {
        let initParams = {localTeam: [], visitorTeam: [], referees: []}
        if (this.game && !this.isGameStarted()) {
            this.localTeam.players.forEach(player => {
                let selected, number, startingLineup;
                try {
                    selected = this.localTeamPlayersForm.value[player._id.toString() + '_selected'];
                    number = parseInt(this.localTeamPlayersForm.value[player._id.toString() + "_number"]);
                    startingLineup = this.localTeamPlayersForm.value[player._id.toString() + "_startingLineup"];
                } finally {
                    if (selected && number) {
                        initParams.localTeam.push({_id: player._id, number: number, startingLineup: startingLineup});
                    }
                }
            });
            this.visitorTeam.players.forEach(player => {
                let selected, number, startingLineup;
                try {
                    selected = this.visitorTeamPlayersForm.value[player._id + '_selected'];
                    number = parseInt(this.visitorTeamPlayersForm.value[player._id + "_number"]);
                    startingLineup = this.visitorTeamPlayersForm.value[player._id.toString() + "_startingLineup"];
                } finally {
                    if (selected && number) {
                        initParams.visitorTeam.push({_id: player._id, number: number, startingLineup: startingLineup});
                    }
                }
            });
            Object.keys(this.refereesForm.value).forEach(key => {
                if (this.refereesForm.value[key] && this.refereesForm.value[key].length) {
                    initParams.referees.push(this.refereesForm.value[key]);
                }
            });

            try {
                (await this.competitionsService.startGame(this.competitionID, this.gameID, initParams));
                this.toastr.success("Partido iniciado correctamente.", "Operación satisfactoria");
                (await this.getGame());
            } catch (e) {
                this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
                this.resetForm(this.localTeamPlayersForm);
                this.resetForm(this.visitorTeamPlayersForm);
                this.resetForm(this.refereesForm);
            }
        }
    }

    updateMinute(minute: number) {
        this.lastKnownMinute = minute;
        this.possibleMinutes = this.possibleMinutes.slice(this.possibleMinutes.indexOf(this.lastKnownMinute));
    }

    setModalPlayers(event, formGroup) {
        if (event.value === this.localTeam._id.toString()) {
            this.modalPlayers = this.localPlayers;
            formGroup.get('player').reset();
        } else if (event.value === this.visitorTeam._id.toString()) {
            this.modalPlayers = this.visitorPlayers;
        } else {
            this.modalPlayers = [];
        }

        this.changeDetectorRef.detectChanges();
    }

    getTeamNameByTeamId(teamID) {
        if (teamID.toString() === this.localTeam._id.toString()) {
            return this.localTeam.name;
        } else {
            return this.visitorTeam.name;
        }
    }

    getPlayerNameByPlayerId(teamID, playerID) {
        if (teamID.toString() === this.localTeam._id.toString()) {
            let playerIndex = this.localPlayers.findIndex(player => playerID.toString() === player._id);
            return {
                name: this.localPlayers[playerIndex].name,
                number: this.localPlayers[playerIndex].stats.number
            };
        } else {
            let playerIndex = this.visitorPlayers.findIndex(player => playerID.toString() === player._id);
            return {
                name: this.visitorPlayers[playerIndex].name,
                number: this.visitorPlayers[playerIndex].stats.number
            };
        }
    }

    getFoulType(type) {
        switch (type) {
            case "D":
                return "en defensa";
                break;
            case "A":
                return "en ataqque";
                break;
            case "U":
                return "antideportiva";
                break;
            case "T":
                return "técnica";
                break;
            case "X":
                return "descalificante";
                break;
        }
    }

    canDisplayRemoveEventIcon(type) {
        return this.loginService.isAuthenticated() && (type !== "startGame") && (type !== "startQuarter") && (type !== "endGame")
            && (type !== "endQuarter") && !this.game.winner;
    }

    scrollToTop(): void {
        this.document.body.scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    canEditPlayerNumber(playerID, form) {
        let index = playerID.toString() + "_selected";
        if (this.game && form && form.get(index)) {
            return form.get(playerID + "_selected").value;
        }
        return false;
    }

    printPage() {
        window.print();
    }

    public errorHandling = (form, control: string, error: string) => {
        if (form) return form.controls[control].hasError(error);
    }
};
