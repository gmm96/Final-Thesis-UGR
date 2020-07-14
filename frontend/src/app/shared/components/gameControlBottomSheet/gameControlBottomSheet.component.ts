import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ChangeDetectorRef, Component} from '@angular/core';

@Component({
    selector: 'app-game-control-bottom-sheet',
    templateUrl: 'gameControlBottomSheet.component.html',
    styleUrls: ['./gameControlBottomSheet.component.scss']
})
export class GameControlBottomSheetComponent {
    static timeoutSeconds: number = 60;
    timeoutRemainingSeconds: number = 0;
    interval;

    constructor(private _bottomSheetRef: MatBottomSheetRef<GameControlBottomSheetComponent>,
                private changeDetectorRef: ChangeDetectorRef)
     { }

    callForTimeout(event: MouseEvent) {

        this.timeoutRemainingSeconds = GameControlBottomSheetComponent.timeoutSeconds;
        this.interval = setInterval(() => {
            if (this.timeoutRemainingSeconds > 0) this.timeoutRemainingSeconds--;
            this.changeDetectorRef.detectChanges();
        }, 1000);
    }


    goToNextQuarter(event: MouseEvent) {

    }

    finishGameWithoutSaving(event: MouseEvent): void {
        console.log(event);
        this._bottomSheetRef.dismiss();
        if (confirm('̣̣̣¿Desea realmente finalizar el partido sin disputar?̀\nNinguno de los cambios efectuados tendrán efecto.')) {
            if (confirm('¿Entiende los riesgos que conlleva?\nEl partido volverá a su estado inicial y el estado actual será irrecuperable.')) {

            } else {

            }
        } else {

        }
    }
}
