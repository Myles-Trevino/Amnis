/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


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
	focusKey?: string;
	keyTimings: Map<string, number[]>;
	averageKeyTimings: Map<string, number>;
	averageWpm: number;
	averageErrors: number;
	lessonResults: LessonResult[];
};

export const defaultState: State =
{
	keyTimings: new Map(),
	averageKeyTimings: new Map(),
	averageWpm: 0,
	averageErrors: 0,
	lessonResults: []
};
