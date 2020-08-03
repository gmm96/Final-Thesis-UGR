import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {CompetitionsService} from "../../../core/services/competitions/competitions.service";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-admin-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

    filteredOptions: any;
    games: any = [];
    gameCompatible: any = [];
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    selectCompetitionSub: Subscription;
    selectedCompetition: any;
    competitionForm: FormGroup;
    gameForm: FormGroup;
    game: any;
    @ViewChild('formDirective', {static: true}) formDirective: FormGroupDirective;
    minDate: Date;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private competitionsService: CompetitionsService,
        private fb: FormBuilder,
        private toastr: ToastrService,
    ) {
    }

    async ngOnInit() {
        this.displayedColumns = ['localTeamName', 'visitorTeamName', 'fixture', 'ready'];
        this.competitionForm = this.fb.group({
            'name': [null]
        });
        this.gameForm = this.fb.group({
            'time': ["", Validators.required],
            'location': ["", Validators.required],
        });
        this.selectCompetitionSub = this.competitionForm.get("name").valueChanges.subscribe(async value => {
            (await this.setFilteredOptions(value));
        });
        this.minDate = new Date();
    }

    ngOnDestroy() {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDataTable() {
        if (this.games && this.games.length) {
            this.gameCompatible = this.games.map(item => {
                return {
                    _id: item._id,
                    competitionID: item.competitionID,
                    localTeamName: item.localTeamInfo.team.name,
                    visitorTeamName: item.visitorTeamInfo.team.name,
                    fixture: item.fixture,
                    ready: item.location && item.time,
                }
            });
            this.dataSource = new MatTableDataSource(this.gameCompatible);
            this.dataSource.paginator = this.paginator;
            this.changeDetectorRef.detectChanges();
        }
    }

    async getUnplayedGamesByCompetition() {
        try {
            if (this.selectedCompetition) {
                this.games = (await this.competitionsService.getUnplayedGamesByCompetition(this.selectedCompetition._id));
            }
        } catch (e) {
            console.error(e);
        }
    }

    async clearSelectedCompetition() {
        this.selectedCompetition = null;
        this.competitionForm.controls['name'].setValue("");
        this.games = [];
        this.gameCompatible = [];
        this.dataSource = null;
    }

    async setSelectedCompetition(event) {
        this.selectedCompetition = event.option.value;
        this.competitionForm.controls['name'].setValue(this.selectedCompetition.name);
        (await this.getUnplayedGamesByCompetition());
        (await this.setDataTable());
        this.changeDetectorRef.detectChanges();
    }

    async setFilteredOptions(query: string) {
        try {
            if (query && query.length) this.filteredOptions = (await this.competitionsService.getCompetitionListByName(query));
            else this.filteredOptions = [];
        } catch (e) {
            this.filteredOptions = [];
            console.log(e);
        }
    }

    async editGame(gameID) {
        this.game = this.games.find(game => game._id.toString() === gameID.toString());
        this.gameForm.controls['location'].setValue(this.game.location);
        this.gameForm.controls['time'].setValue(this.game.time);
    }

    async sendEditGame() {
        try {
            let editedGame = (await this.competitionsService.updateGameTimeAndLocation(this.selectedCompetition._id, this.game._id, this.gameForm.value));
            (await this.getUnplayedGamesByCompetition());
            (await this.setDataTable());
            this.setDataTable();
            this.formDirective.resetForm();
            this.toastr.success("Partido editado correctamente.", "Operación satisfactoria");
        } catch (e) {
            console.error(e);
            this.toastr.error((e && e.error && e.error.message) ? e.error.message : "Error desconococido, vuelva a intentarlo.", "Error");
        }
    }

    resetGameForm() {
        this.formDirective.resetForm();
        this.game = null;
    }

    public errorHandling = (control: string, error: string) => {
        if (this.gameForm) return this.gameForm.controls[control].hasError(error);
    }
}
