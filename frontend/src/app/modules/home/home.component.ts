import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HomeService} from "../../core/services/home/home.service";
import {Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {SearchBoxResultInterface} from "../../core/services/home/home";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

    searchControlHome = new FormControl();
    searchSubscription: Subscription;
    filteredOptions: SearchBoxResultInterface[];

    constructor(
        private router: Router,
        private homeService: HomeService
    ) {
    }

    ngOnInit() {
        this.searchSubscription = this.searchControlHome.valueChanges.subscribe(
            (value) => {
                this._filter(value)
            }
        );
    }

    ngOnDestroy() {
        this.searchSubscription.unsubscribe();
    }

    private async _filter(value: string) {
        try {
            this.filteredOptions = await this.homeService.searchResults(value);
            // console.log(this.filteredOptions);
        } catch (e) {
            console.log(e);
        }
    }

    goToResultPage(event) {
        let selectedOption = event.option.value;
        this.searchControlHome.setValue(selectedOption.name);
        this.router.navigate(['/' + selectedOption.type.toLowerCase() + 's/' + selectedOption._id]);
        this.searchControlHome.setValue("");
    }
};
