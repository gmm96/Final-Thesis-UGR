import {ChangeDetectorRef, Component, HostListener, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {Animations} from "../../animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-game-control',
    templateUrl: './gameControl.component.html',
    styleUrls: ['./gameControl.component.scss'],
    animations: [Animations.bottomSheet, Animations.simpleFade],
})

export class GameControlComponent implements OnInit {

    windowScrolled: boolean;
    windowScrolledMaxValue: number = 200;
    windowScrolledMinValue: number = 10;
    openedBottomSheet: boolean = false;
    canCloseBottomSheet: boolean = false;
    static timeoutSeconds: number = 60;
    timeoutRemainingSeconds: number = 0;
    teamRoster = [...Array(15).keys()];
    possibleMinutes: Array<number>;
    interval;
    basketFormGroup: FormGroup;
    freeThrowFormGroup: FormGroup;
    foulFormGroup: FormGroup;
    timeoutFormGroup: FormGroup;
    lastKnownMinute: number;
    currentQuarter: number;

    constructor(
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.windowScrolled = false;
        this.possibleMinutes = Array.from(Array((10)), (v, i) => i + 1);
        this.updateMinute(1);
        this.currentQuarter = 1;

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
    }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if ([window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop].some((value) => value > this.windowScrolledMaxValue)) {
            this.windowScrolled = true;
        } else if (this.windowScrolled && [window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop].some((value) => value < this.windowScrolledMinValue)) {
            this.windowScrolled = false;
        }
    }

    closeBottomSheet() {
        this.canCloseBottomSheet = true;
        this.openedBottomSheet = false;
        setTimeout(() => this.canCloseBottomSheet = false, 300);
    }

    resetForm(formGroup) {
        formGroup.reset();
    }

    callForTimeout() {
        this.updateMinute(this.basketFormGroup.controls['minute'].value);
        this.timeoutRemainingSeconds = GameControlComponent.timeoutSeconds;
        this.interval = setInterval(() => {
            if (this.timeoutRemainingSeconds > 0) this.timeoutRemainingSeconds--;
            this.changeDetectorRef.detectChanges();
        }, 1000);
        setTimeout(()=> this.resetForm(this.timeoutFormGroup), 0);

    }

    callForAFoul() {
        this.updateMinute(this.foulFormGroup.controls['minute'].value);
        setTimeout( () => this.resetForm(this.foulFormGroup), 0);

    }

    annotateFreeThrow() {
        this.updateMinute(this.freeThrowFormGroup.controls['minute'].value);
        setTimeout( () => this.resetForm(this.freeThrowFormGroup), 0);
    }

    annotateBasket() {
        this.updateMinute(this.basketFormGroup.controls['minute'].value);
        setTimeout( () => this.resetForm(this.basketFormGroup), 0);
    }

    goToNextQuarter() {
        this.closeBottomSheet();
        // si resultado distinto y q = 4, finalizar partido
        if (this.canFinishGame()) {
            if (confirm('̣̣̣¿Desea finalizar el partido en su estado actual?')) {

            }
        } else {
            if (confirm('̣̣̣¿Desea avanzar al siguiente cuarto?')) {
                this.currentQuarter += 1;
                this.updateMinute(1 + 10 * (this.currentQuarter - 1));
                if (this.currentQuarter <= 4) {
                    this.possibleMinutes = Array.from(Array((10)), (v, i) => i + (this.currentQuarter - 1) * 10 + 1);
                } else {
                    this.possibleMinutes = Array.from(Array((5)), (v, i) => i + 40 + 1 + (this.currentQuarter - 4) * 5);
                }
            }
        }
    }

    canFinishGame(): boolean {
        return this.currentQuarter == 4;
    }

    finishGameWithoutSaving(): void {
        this.closeBottomSheet();
        if (confirm('̣̣̣¿Desea realmente finalizar el partido sin disputar?̀\nNinguno de los cambios efectuados tendrán efecto.')) {
            if (confirm('¿Entiende los riesgos que conlleva?\nEl partido volverá a su estado inicial y el estado actual será irrecuperable.')) {

            }
        }
    }

    updateMinute(minute: any) {
        this.lastKnownMinute = parseInt(minute);
        this.possibleMinutes = this.possibleMinutes.slice(this.possibleMinutes.indexOf(this.lastKnownMinute));
    }

    scrollToTop(): void {
        this.document.body.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
};
