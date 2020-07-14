import {Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";

@Component({
    selector: 'app-team-info',
    templateUrl: './teamInfo.component.html',
    styleUrls: ['./teamInfo.component.scss']
})
export class TeamInfoComponent implements OnInit, OnDestroy {

    @Input('team') team: any;
    tableData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        moment.locale('es');
        if (this.team) {
            this.setTeamInfo();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setTeamInfo();
    }


    ngOnDestroy() {
    }

    setTeamInfo() {
        if (this.team) {
            this.tableData = [
                {name: "Nombre", value: this.team.name},
                {name: "Ciudad", value: this.team.city},
                {name: "Sede", value: this.team.address},
                {name: "Equipación local", value: this.team.localJersey},
                {name: "Equipación visitante", value: this.team.visitorJersey},
                {name: "Registrado en", value: new Date(this.team.createdAt).toLocaleDateString()},
            ];
        }
    }
}

