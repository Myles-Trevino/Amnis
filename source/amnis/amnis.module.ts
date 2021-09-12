/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NgxElectronModule} from 'ngx-electron';

import {RoutingModule} from './routing.module';
import {AmnisComponent} from './amnis.component';
import {PracticeComponent} from './practice/practice.component';
import {StatisticsComponent} from './statistics/statistics.component';


@NgModule
({
	declarations:
	[
		AmnisComponent,
		PracticeComponent,
		StatisticsComponent
	],
	imports:
	[
		BrowserModule,
		RoutingModule,
		NgxElectronModule
	],
	providers: [],
	bootstrap: [AmnisComponent]
})

export class AmnisModule{}
