/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PracticeComponent} from './practice/practice.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {OptionsComponent} from './options/options.component';


const routes: Routes =
[
	{path: '', redirectTo: 'practice', pathMatch: 'full'},
	{path: 'practice', component: PracticeComponent},
	{path: 'statistics', component: StatisticsComponent},
	{path: 'options', component: OptionsComponent}
];

@NgModule
({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class RoutingModule{}
