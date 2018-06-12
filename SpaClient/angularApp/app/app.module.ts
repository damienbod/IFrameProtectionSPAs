import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import {
    AuthModule,
    OidcSecurityService,
    OpenIDImplicitFlowConfiguration,
    OidcConfigService,
    AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    // const sts = 'https://localhost:44334';
    const sts = 'https://stsidentityserver420180612084014.azurewebsites.net';
    return () => oidcConfigService.load_using_stsServer(sts);
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        AuthModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent
    ],
    providers: [
        OidcConfigService,
        OidcSecurityService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true
        },
        Configuration
    ],
    bootstrap: [AppComponent],
})


export class AppModule {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
    ) {
         const sts = 'https://localhost:44334';
         const deployment = 'https://localhost:44372';
        //const sts = 'https://stsidentityserver420180612084014.azurewebsites.net';
        //const deployment = 'http://spaclient20180612093422.azurewebsites.net';

        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

            openIDImplicitFlowConfiguration.stsServer = sts;
            openIDImplicitFlowConfiguration.redirect_url = deployment;
            openIDImplicitFlowConfiguration.client_id = 'angularclient';
            openIDImplicitFlowConfiguration.response_type = 'id_token token';
            openIDImplicitFlowConfiguration.scope = 'openid profile email';
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = deployment + '/Unauthorized';
            openIDImplicitFlowConfiguration.start_checksession = false;
            openIDImplicitFlowConfiguration.silent_renew = true;
            openIDImplicitFlowConfiguration.silent_renew_url = deployment + '/silent-renew.html';
            openIDImplicitFlowConfiguration.post_login_route = '/home';
            openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
            openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';
            openIDImplicitFlowConfiguration.log_console_warning_active = true;
            openIDImplicitFlowConfiguration.log_console_debug_active = true;
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 3;
            openIDImplicitFlowConfiguration.auto_clean_state_after_authentication = false;

            const authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

        });
    }
}
