import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from 'moment';

@Component({
    selector: 'app-player-info',
    templateUrl: './playerInfo.component.html',
    styleUrls: ['./playerInfo.component.scss']
})
export class PlayerInfoComponent implements OnInit, OnDestroy {

    @Input('player') player: any;
    tableData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        moment.locale('es');
        if (this.player) {
            this.setPlayerInfo();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setPlayerInfo();
    }


    ngOnDestroy() {
    }

    setPlayerInfo() {
        if (this.player) {
            let playerAge = (moment(this.player.birthDate).fromNow(true));
            this.tableData = [
                {name: "Nombre", value: this.player.name},
                {name: "Apellidos", value: this.player.surname},
                {name: "Edad", value: playerAge},
                {name: "Lugar de nacimiento", value: this.player.birthPlace},
                {name: "Altura", value: this.player.height.toString() + " m"},
                {name: "Peso", value: this.player.weight.toString() + " Kg"},
                {name: "Registrado en", value: new Date(this.player.createdAt).toLocaleDateString()}
            ];
        }
    }
}

