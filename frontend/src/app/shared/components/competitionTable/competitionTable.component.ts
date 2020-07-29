import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-competition-table',
    templateUrl: './competitionTable.component.html',
    styleUrls: ['./competitionTable.component.scss']
})
export class CompetitionTableComponent implements OnInit, OnDestroy {

    @Input('competitions') competitions: Array<any>;
    competitionsCompatible: any;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.displayedColumns = ['teamName', 'competitionName', 'season', 'class', 'sex'];
    }

    ngOnDestroy() {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setDataTable();
    }

    setDataTable() {
        if (this.competitions) {
            this.competitionsCompatible = this.competitions.map(item => {
                return {
                    competitionID: item._id,
                    competitionName: item.name,
                    teamID: item.team._id,
                    teamName: item.team.name,
                    playerID: (item.player) ? item.player._id : null,
                    season: item.season,
                    class: item.class,
                    sex: item.sex.charAt(0).toUpperCase(),
                }
            });
            this.dataSource = new MatTableDataSource(this.competitionsCompatible);
        }
    }

    goToPageInCompetition(row) {
        if (row.playerID)
            this.router.navigate(["/competitions/" + row.competitionID + "/teams/" + row.teamID + "/players/" + row.playerID]);
        else
            this.router.navigate(["/competitions/" + row.competitionID + "/teams/" + row.teamID]);
    }
};
