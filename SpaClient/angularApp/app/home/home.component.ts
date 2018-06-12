import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {

    message: string;
    name = 'none';
    userDataSubscription: Subscription | undefined;
    userData = false;
    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(public oidcSecurityService: OidcSecurityService) {
        this.message = 'HomeComponent constructor';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });

        this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
            (userData: any) => {

                if (userData !== '') {
                    this.name = userData.name;
                    console.log(userData);
                }

                console.log('userData getting data');
            });
    }

    ngOnDestroy(): void {
        if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
        }

        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }
}
