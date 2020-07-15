import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../core/auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    constructor(
        private router: Router,
        private loginService: AuthService,
        public fb: FormBuilder
    ) {
    }

    loginForm: FormGroup
    hide: boolean = true;

    ngOnInit() {
        this.loginForm = this.fb.group({
            'username': [null, Validators.email],
            'password': [null, Validators.required]
        })
    }

    async login($event) {
        $event.preventDefault();
        for (let c in this.loginForm.controls) {
            this.loginForm.controls[c].markAllAsTouched()
        }

        if (this.loginForm.valid) {
            try {
                await this.loginService.login(
                    {
                        username: this.loginForm.value.username,
                        password: this.loginForm.value.password
                    }
                );
                let me = await this.loginService.getMe()
                this.router.navigate(['/admin']);
            } catch (e) {
                console.log("ERROR!")
            }
        }
    }

    public errorHandling = (control: string, error: string) => {
        return this.loginForm.controls[control].hasError(error);
    }
};
