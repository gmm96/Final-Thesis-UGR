import {animate, style, transition, trigger} from '@angular/animations';

export const Animations = {
    avoidAnimatedTabsFirstEvent: trigger('avoidAnimatedTabsFirstEvent', [
        transition(':enter', [])
    ]),
    animatedTabs: trigger('animatedTabs', [
        transition(':enter', [
            style({opacity: 0, transform: 'translateY(50%)'}),
            animate('.5s ease', style({opacity: 1, transform: 'translateX(0)'}))
        ]),
        // transition(':leave', [
        //     style({opacity: 1, transform: 'translateX(0)', position: 'static'}),
        //     animate('.5s ease-out', style({opacity: 0, transform: 'translateX(-100%)', position: 'absolute'}))
        // ])
    ]),
    bottomSheet: trigger('bottomSheet', [
        transition(':enter', [
            style({opacity: 0, transform: 'translateY(100%)'}),
            animate('.3s ease', style({opacity: 1, transform: 'translateX(0)'}))
        ]),
        transition(':leave', [
            style({opacity: 1, transform: 'translateY(0)'}),
            animate('.3s ease', style({opacity: 0, transform: 'translateY(100%)'}))
        ])
    ]),
    simpleFade: trigger('simpleFade', [
        transition(':enter', [
            style({opacity: 0}),
            animate('.5s ease-in', style({opacity: 1}))
        ]),
        transition(':leave', [
            style({opacity: 1}),
            animate('.5s ease-out', style({opacity: 0}))
        ])
    ]),
    floatingSearchBox: trigger('floatingSearchBox', [
        transition(':enter', [
            style({transform: 'translateY(-100%) translateX(25%) scale(0)', 'opacity': 0}),
            animate('350ms ease', style({transform: 'translateY(0) translateX(0) scale(1)', 'opacity': 1}))
        ]),
        transition(':leave', [
            style({transform: 'translateY(0) translateX(0) scale(1)', 'opacity': 1}),
            animate('350ms ease', style({transform: 'translateY(-100%) translateX(25%) scale(0)', 'opacity': 0})),
        ])
    ]),
    adminPanel: trigger('adminPanel', [
        transition(':enter', [
            style({transform: 'translateY(-100%) translateX(50%) scale(0)', 'opacity': 0}),
            animate('350ms ease', style({transform: 'translateY(0) translateX(0) scale(1)', 'opacity': 1}))
        ]),
        transition(':leave', [
            style({transform: 'translateY(0) translateX(0) scale(1)', 'opacity': 1}),
            animate('350ms ease', style({transform: 'translateY(-100%) translateX(50%) scale(0)', 'opacity': 0})),
        ])
    ])
}
