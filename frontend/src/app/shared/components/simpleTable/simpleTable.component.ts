import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-simple-table',
    templateUrl: './simpleTable.component.html',
    styleUrls: ['./simpleTable.component.scss']
})
export class SimpleTableComponent implements OnInit, OnDestroy {

    @Input('tableData') tableData: any;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.setTableData();
        this.displayedColumns = ['name', 'value'];
    }

    ngOnDestroy() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setTableData();
    }

    setTableData() {
        this.dataSource = new MatTableDataSource(this.tableData);
    }

}

export interface TeamStatsInterface {
    name: string;
    value: any;
}
