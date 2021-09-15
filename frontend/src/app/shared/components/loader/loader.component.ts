import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit, OnDestroy {

    public lottieConfig: Object;
    private animation: any;
    private animationSpeed: number = 1;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.lottieConfig = {
            path: "assets/lottie/loader2.json",
            renderer: 'svg',
            autoplay: true,
            loop: true
        };
    }

    ngOnDestroy() {
        if (this.animation) {
            this.animation.destroy();
        }
    }

    setAnimation(anim: any) {
        this.animation = anim;
    }

    stop() {
        this.animation.stop();
    }

    play() {
        this.animation.play();
    }

    pause() {
        this.animation.pause();
    }

    setSpeed(speed: number) {
        this.animationSpeed = speed;
        this.animation.setSpeed(speed);
    }
};
