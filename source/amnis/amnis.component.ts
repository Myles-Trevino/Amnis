/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';

import {StateService} from './services/state.service';


@Component
({
	selector: 'amnis-root',
	templateUrl: './amnis.component.html',
	styleUrls: ['./amnis.component.scss']
})

export class AmnisComponent implements OnInit
{
	public isMac = false;
	public page = 'Practice';


	// Constructor.
	public constructor(private readonly electronService: ElectronService,
		private readonly stateService: StateService){}


	// Initializer.
	public ngOnInit(): void
	{
		// Show the window.
		setTimeout(() => { this.electronService.ipcRenderer.send('show-window'); }, 250);

		// Load the state.
		this.stateService.load();
	}

	// Window controls.
	public minimize(): void { this.electronService.ipcRenderer.send('minimize'); }

	public close(): void { this.electronService.ipcRenderer.send('close'); }


	// Sets the page.
	public setPage(page: string): void { this.page = page; }
}
