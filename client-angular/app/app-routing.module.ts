import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AthleteEditorComponent }  from './athlete-editor.component';
import { ModalComponent } from './modal.component';
import { FloorDisplayComponent } from './floor-display.component';
import { DisplayComponent } from './display.component';
import { RoutineListComponent } from './routine-list.component';
import { LoginComponent } from './login.component';
import { ConfigComponent } from './config.component';
import { PageNotFoundComponent } from './not-found.component';

import { AuthGuard } from './auth-guard.service';

const appRoutes : Routes = [
	{
		path : 'routine/:id',
		component : DisplayComponent,
		canActivate : [ AuthGuard ]
	},
	{
		path : 'routine',
		component : RoutineListComponent,
		canActivate : [ AuthGuard ]
	},
	{
		path : 'login',
		component : LoginComponent
	},
	{
		path : '',
		component : LoginComponent
	},
	{
		path : 'config',
		component : ConfigComponent,
		canActivate : [ AuthGuard ]
	},
	{
		path : '**',
		component : PageNotFoundComponent
	}
]

@NgModule({
	imports : [
		RouterModule.forRoot(appRoutes)
	],
	exports : [
		RouterModule
	]
})
export class AppRoutingModule {}