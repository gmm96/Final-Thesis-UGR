import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {AdminComponent} from "./admin.component";


const adminRoutes: Routes = [
    // {path: ':id', component: PlayerDetailsComponent},

    {path: '**', component: AdminComponent}
];

@NgModule({
    declarations: [
        AdminComponent,
    ],
    imports: [
        RouterModule.forChild(adminRoutes),
        CommonModule,
        SharedModule
    ],
    providers: [
        AdminComponent,
    ],
    exports: [RouterModule]
})

export class AdminModule {
}
