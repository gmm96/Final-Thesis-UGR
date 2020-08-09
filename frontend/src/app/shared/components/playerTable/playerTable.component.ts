import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import * as moment from "moment";

@Component({
    selector: 'app-player-table',
    templateUrl: './playerTable.component.html',
    styleUrls: ['./playerTable.component.scss']
})
export class PlayerTableComponent implements OnInit, OnDestroy {

    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    @Input('roster') roster: any;
    @Input('teamID') teamID: string;
    @Input('competitionID') competitionID;
    rosterCompatible: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.setDataTable();
        this.displayedColumns = ['name', 'age', 'height', 'weight'];
    }

    ngOnDestroy() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setDataTable();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDataTable() {
        if (this.roster) {
            this.rosterCompatible = this.roster.map(item => {
                let today = moment(new Date());
                return {
                    _id: item._id,
                    name: item.name + " " + item.surname,
                    age: today.diff(moment(item.birthDate), "years"),
                    height: item.height,
                    weight: item.weight,
                    avatar: item.avatar ? "http://localhost:3000" + item.avatar : null
                };
            });
            this.rosterCompatible.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            this.dataSource = new MatTableDataSource(this.rosterCompatible);
            this.changeDetectorRef.detectChanges();
        }
    }

    goToPlayer(player) {
        if (this.competitionID) {
            this.router.navigate(["/competitions/" + this.competitionID + "/teams/" + this.teamID + "/players/" + player._id]);
        } else {
            this.router.navigate([/players/ + player._id]);
        }
    }
};
