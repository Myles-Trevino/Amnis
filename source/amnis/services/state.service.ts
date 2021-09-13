/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Injectable} from '@angular/core';

import * as Types from '../../types';
import * as Constants from '../../constants';


@Injectable({providedIn: 'root'})

export class StateService
{
	public state = Types.defaultState;


	// Saves the state.
	public save(): void
	{
		/* eslint-disable */
		const json = JSON.stringify(this.state, (key, value) =>
		{
			if(value instanceof Map) return {type: 'Map', data: [...value] };
			return value;
		});
		/* eslint-enable */

		localStorage.setItem(Constants.stateKey, json);
	}


	// Loads the state.
	public load(): void
	{
		const savedState = localStorage.getItem(Constants.stateKey);

		// If state has been saved, load it.
		if(savedState)
		{
			// Parse.
			/* eslint-disable */
			const loadedState = JSON.parse(savedState, (key, value) =>
			{
				if(typeof value === 'object' && value !== null)
					if(value.type === 'Map') return new Map(value.data);

				return value;
			}) as Types.State;
			/* eslint-enable */

			// Only load the state if it meets the minimum version requirement.
			if(loadedState.version >= Constants.minimumStateVersion)
				this.state = loadedState;
		}

		// Initialize the state.
		for(const key of Constants.keys)
			if(!this.state.averageKeyTimings.has(key))
				this.state.averageKeyTimings.set(key, 0);
	}


	// Resets the state.
	public reset(): void
	{
		this.state = Types.defaultState;
		this.save();
		this.load();
	}
}
