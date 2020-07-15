import {Component, OnDestroy, OnInit} from "@angular/core";
import {Animations} from "../../shared/animations";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    animations: [Animations.adminPanel, Animations.floatingSearchBox]
})
export class AdminComponent implements OnInit, OnDestroy {

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
