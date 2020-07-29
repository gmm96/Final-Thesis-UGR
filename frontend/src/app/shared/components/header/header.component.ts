import {ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ResolveStart, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {HomeService} from "../../../core/services/home/home.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {SearchBoxResultInterface} from "../../../core/services/home/home";
import {AuthService} from "../../../core/auth/auth.service";
import {Animations} from "../../animations";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [Animations.adminPanel, Animations.floatingSearchBox]
})
export class HeaderComponent implements OnInit, OnDestroy {

    searchControlHeader = new FormControl();
    filteredOptions: SearchBoxResultInterface[] = [];
    private searchSubscription: Subscription;
    private routerSub: Subscription;
    showSearchBox: boolean = true;
    openedSearchBox: boolean = false;
    clickInsideSearchBox: boolean = false;
    private static NOT_SEARCH_SHOWN = ["/home"];
    @ViewChild( 'searchbox', {static: false} ) searchBoxInput: ElementRef;
    openedAdminPanel = false;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private homeService: HomeService,
        private changeDetectorRef: ChangeDetectorRef,
        private loginService: AuthService
    ) {
    }


    ngOnInit() {
        this.routerSub = this.router.events.subscribe((event) => {
            this.openedSearchBox = false;

            if (event instanceof ResolveStart) {
                this.showSearchBox = !HeaderComponent.NOT_SEARCH_SHOWN.includes(event.urlAfterRedirects)
            }
        });
        this.searchSubscription = this.searchControlHeader.valueChanges.subscribe((value) => {
            this._filter(value)
        });
    }

    ngOnDestroy() {
        this.routerSub.unsubscribe();
        this.searchSubscription.unsubscribe();
    }

    @HostListener('click')
    clickInside() {
        this.clickInsideSearchBox = true;
    }

    @HostListener('document:click')
    clickout() {
        if (!this.clickInsideSearchBox) {
            if (this.openedSearchBox) this.searchControlHeader.setValue("");
            this.openedSearchBox = false;
            this.openedAdminPanel = false;
        }
        this.clickInsideSearchBox = false;
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (this.openedSearchBox) {
            this.toggleSearchBox();
        }
    }

    goToLogin(): void {
        this.router.navigate(['login']);
    }

    goToIndex(): void {
        this.router.navigate(['home']);
    }

    private async _filter(value: string) {
        try {
            if (value) this.filteredOptions = (await this.homeService.searchResults(value));
        } catch (e) {
            console.log(e);
        }
    }

    goToResultPage(event) {
        let selectedOption = event.option.value;
        this.searchControlHeader.setValue(selectedOption.name);
        this.router.navigate(['/' + selectedOption.type.toLowerCase() + 's/' + selectedOption._id]);
        this.toggleSearchBox();
        this.searchControlHeader.setValue("");
        this.changeDetectorRef.detectChanges();
    }

    toggleSearchBox() {
        this.openedSearchBox = !this.openedSearchBox;
        this.changeDetectorRef.detectChanges();
        if (this.openedSearchBox) {
            this.openedAdminPanel = false;
            this.searchBoxInput.nativeElement.focus();
        }
        if (!this.openedSearchBox) this.searchControlHeader.setValue("");
    }

    toggleAdminPanel() {
        this.openedAdminPanel = !this.openedAdminPanel;
        if (this.openedAdminPanel) this.openedSearchBox = false;
    }

    getUserToken() {
        return localStorage.getItem('token');
    }

    logout() {
        this.openedAdminPanel = false;
        this.loginService.logout();
    }

    goToAdminPage() {
        this.openedAdminPanel = false;
        this.router.navigate(['/admin']);
    }
}
