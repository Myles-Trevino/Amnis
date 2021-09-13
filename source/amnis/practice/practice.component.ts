/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Component, OnInit, HostListener} from '@angular/core';

import * as Types from '../../types';
import * as Constants from '../../constants';
import Words from '../../words';
import {StateService} from '../services/state.service';


@Component
({
	selector: 'amnis-practice',
	templateUrl: './practice.component.html',
	styleUrls: ['./practice.component.scss']
})

export class PracticeComponent implements OnInit
{
	public math = Math;
	public state = this.stateService.state;
	public characters = new Array<Types.Character>();
	public constants = Constants;
	public delta?: number;
	public averageErrorsDelta = 0;
	public averageWpmDelta = 0;
	public wpm = 0;
	public errors = 0;

	private readonly wordMap = new Map<string, string[]>();
	private text = '';
	private characterIndex = 0;
	private startTime?: DOMHighResTimeStamp;
	private previousTime?: DOMHighResTimeStamp;

	// Constructor.
	public constructor(private readonly stateService: StateService){}


	@HostListener('window:keydown', ['$event'])
	public keyEvent(event: KeyboardEvent): void
	{
		// Only handle characters.
		const key = event.key.toLowerCase();
		if(event.repeat || /^[a-z ]$/.exec(key) === null) return;

		// If this is the wrong character, set the wrong flag and return.
		const currentCharacter = this.characters[this.characterIndex];

		if(currentCharacter.character !== key)
		{
			// Ignore consecutive errors on the same letter.
			if(currentCharacter.wrong) return;

			++this.errors;
			currentCharacter.wrong = true;
			return;
		}

		// Otherwise, update the timings.
		const time = performance.now();

		if(this.characterIndex === 0)
		{
			this.errors = 0;
			this.wpm = 0;
			this.startTime = time;
		}

		this.updateTimings(key, time);
		this.previousTime = time;

		// Calculate WPM.
		if(this.characterIndex > 0 && this.startTime !== undefined)
		{
			const delta = (time-this.startTime)/1000; // Delta in seconds.
			const words = (this.characterIndex+1)/5; // 5 characters per word.
			this.wpm = Math.trunc((60/delta)*words);
		}

		// Set the typed flag and move to the next character.
		currentCharacter.typed = true;
		currentCharacter.current = false;
		++this.characterIndex;

		// If this was the last character, generate new text and return.
		if(this.characterIndex >= this.characters.length)
		{
			this.lessonCompleted();
			return;
		}

		// Otherwise set the character's current flag.
		this.characters[this.characterIndex].current = true;
	}


	@HostListener('window:click')
	public mouseEvent(): void { this.reset(); }


	// Initializer.
	public ngOnInit(): void
	{
		this.state = this.stateService.state;
		this.generateMap();
		this.generateText();
	}


	// Test.
	public keysTrackBy(index: number): number { return index; }


	// Generates the word map.
	private generateMap(): void
	{
		// For each key, for each word, if the word contains
		// the key, add it to that entry in the map.
		for(const key of Constants.keys)
			for(const word of Words)
				if(word.includes(key))
				{
					const entry = this.wordMap.get(key);
					if(!entry) this.wordMap.set(key, [word]);
					else entry.push(word);
				}
	}


	// Generates text to type.
	private generateText(): void
	{
		this.text = '';

		// Use words that contain the focus key.
		let words: string[] | undefined = undefined;
		words = this.wordMap.get(this.state.focusKey);

		// Otherwise use the full word list.
		if(!words) words = Words;

		// Generate the text.
		for(let i = 0; i < Constants.wordCount; ++i)
		{
			const index = Math.trunc(Math.random()*words.length);
			this.text += words[index];
			if(i < Constants.wordCount-1) this.text += ' ';
		}

		// Create the characters array.
		this.characterIndex = 0;
		this.characters = [];

		for(const character of this.text) this.characters.push(
			{character, current: false, typed: false, wrong: false});

		this.characters[0].current = true;
	}


	// Updates the timings for the given key.
	private updateTimings(key: string, time: DOMHighResTimeStamp): void
	{
		// Return if this is the space key or there is no previous time.
		if(key === ' ' || this.previousTime === undefined) return;

		// Calculate the time it took to press the key.
		this.delta = Math.min(time-this.previousTime, Constants.maximumDelta);

		// Add that time to the key's timings.
		const entry = this.state.keyTimings.get(key);

		if(!entry) this.state.keyTimings.set(key, [this.delta]);
		else
		{
			entry.push(this.delta);

			// Limit the number of timings by removing the oldest entries.
			if(entry.length > Constants.maximumTimings)
				entry.splice(0, entry.length-Constants.maximumTimings);
		}
	}


	// Lesson completion callback.
	private async lessonCompleted(): Promise<void>
	{
		// Save the lesson result.
		const lessonResults = this.state.lessonResults;
		lessonResults.push({wpm: this.wpm, errors: this.errors});

		if(lessonResults.length > Constants.maximumLessonResults)
			lessonResults.splice(0, lessonResults.length-Constants.maximumLessonResults);

		// Reset the status bar classes.
		this.averageErrorsDelta = 0;
		this.averageWpmDelta = 0;
		await this.sleep();

		// Calculate the new average WPM and average errors.
		let averageErrors = 0;
		let averageWpm = 0;

		for(const lessonResult of lessonResults)
		{
			averageErrors += lessonResult.errors;
			averageWpm += lessonResult.wpm;
		}

		averageErrors /= lessonResults.length;
		averageWpm /= lessonResults.length;

		this.averageErrorsDelta = averageErrors-this.state.averageErrors;
		this.averageWpmDelta = averageWpm-this.state.averageWpm;

		this.state.averageErrors = averageErrors;
		this.state.averageWpm = averageWpm;

		// Calculate the updated average timings.
		let least = Number.MAX_VALUE;
		let greatest = Number.MIN_VALUE;
		let worstKey = '';

		for(const key of Constants.keys)
		{
			// Calculate the average timing.
			let average = 0;
			const timings = this.state.keyTimings.get(key);

			if(timings)
			{
				for(const timing of timings) average += timing;
				average /= timings.length;
			}

			// Set the average timing and keep track
			// of the least and greatest averages.
			this.state.averageKeyTimings.set(key, average);

			if(average < least) least = average;

			if(average > greatest)
			{
				greatest = average;
				worstKey = key;
			}
		}

		// Normalize the average timings.
		for(const [key, average] of this.state.averageKeyTimings)
			this.state.averageKeyTimings.set(key, (average-least)/(greatest-least));

		// Set the next focus key.
		const nextUncalibratedKey = this.state.uncalibratedKeys.shift();
		if(nextUncalibratedKey) this.state.focusKey = nextUncalibratedKey;
		else
		{
			this.state.calibrated = true;
			this.state.focusKey = worstKey;
		}

		// Save the state.
		this.stateService.save();

		// Reset.
		this.reset();
	}


	// Resets.
	private reset(): void
	{
		// Reset.
		this.previousTime = 0;

		// Generate the next text.
		this.generateText();
	}


	// Sleeps for the given duration in milliseconds.
	private sleep(milliseconds?: number): Promise<void>
	{ return new Promise((resolve) => { setTimeout(resolve, milliseconds); }); }
}
