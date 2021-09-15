import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../core/auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    constructor(
        private router: Router,
        private loginService: AuthService,
        public fb: FormBuilder,
        private titleService: Title,
        private toastr: ToastrService,
    ) {
    }

    loginForm: FormGroup
    hide: boolean = true;

    ngOnInit() {
        this.loginForm = this.fb.group({
            'username': [null, Validators.compose([Validators.required, Validators.email])],
            'password': [null, Validators.required]
        });
        this.titleService.setTitle("Login");
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
                this.toastr.success("Usuario identificado correctamente", "Operación satisfactoria");
            } catch (e) {
                this.toastr.error("Usuario y/o contraseña inválido/s.", "Error");
            }
        }
    }

    public errorHandling = (control: string, error: string) => {
        return this.loginForm.controls[control].hasError(error);
    }
};
