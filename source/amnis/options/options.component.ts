/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Component} from '@angular/core';

import * as Types from '../../types';
import * as Constants from '../../constants';
import {StateService} from '../services/state.service';


@Component
({
	selector: 'amnis-options',
	templateUrl: './options.component.html',
	styleUrls: ['./options.component.scss']
})

export class OptionsComponent
{
	public constants = Constants;

	// Constructor.
	public constructor(public readonly stateService: StateService){}
}
