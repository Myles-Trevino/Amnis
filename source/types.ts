/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/

import * as Constants from './constants';


export type Character =
{
	character: string;
	current: boolean;
	typed: boolean;
	wrong: boolean;
};


export type LessonResult = {wpm: number; errors: number};

export type State =
{
	version: number;
	calibrated: boolean;
	uncalibratedKeys: string[];
	focusKey: string;
	keyTimings: Map<string, number[]>;
	averageKeyTimings: Map<string, number>;
	lessonResults: LessonResult[];
	averageWpm: number;
	averageErrors: number;
};

export const defaultState: State =
{
	version: Constants.stateVersion,
	calibrated: false,
	uncalibratedKeys: Constants.keys.slice(1),
	focusKey: Constants.keys[0],
	keyTimings: new Map(),
	averageKeyTimings: new Map(),
	lessonResults: [],
	averageWpm: 0,
	averageErrors: 0
};
