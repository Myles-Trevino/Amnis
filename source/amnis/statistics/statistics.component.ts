/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Component, HostListener, ViewChild, ElementRef,
	AfterViewInit, ChangeDetectorRef} from '@angular/core';
import * as D3 from 'd3';

import * as Types from '../../types';
import * as Constants from '../../constants';
import {StateService} from '../services/state.service';


@Component
({
	selector: 'amnis-statistics',
	templateUrl: './statistics.component.html',
	styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements AfterViewInit
{
	@ViewChild('statisticsGraph') private readonly graph?: ElementRef;

	public notEnoughData = true;


	// Constructor.
	public constructor(private readonly stateService: StateService,
		private readonly changeDetectorRef: ChangeDetectorRef){}


	// Resize callback.
	@HostListener('window:resize', ['$event'])
	public onResize(): void { this.createGraph(); }


	// Initializer.
	public ngAfterViewInit(): void { this.createGraph(); }


	// Creates the graph.
	private createGraph(): void
	{
		const lessonResults = this.stateService.state.lessonResults;

		this.notEnoughData = lessonResults.length < Constants.minimumGraphPoints;
		this.changeDetectorRef.detectChanges();
		if(this.notEnoughData) return;

		// Calculate the maximum y-axis value.
		let maximumY = 0;
		for(const lessonResult of lessonResults)
			if(lessonResult.wpm > maximumY) maximumY = lessonResult.wpm;

		// Dimensions and margins.
		const graphElement = this.graph ?
			this.graph.nativeElement as HTMLDivElement : undefined;

		if(!graphElement) return;

		const pointSize = 4;
		const margin = {top: pointSize, right: pointSize,
			bottom: pointSize, left: pointSize};

		const width = graphElement.clientWidth-margin.left-margin.right;
		const height = graphElement.clientHeight-margin.top-margin.bottom;

		// Remove any existing SVGs.
		D3.select('#statistics-graph svg').remove();

		// SVG.
		const svg = D3.selectAll('#statistics-graph')
			.append('svg')
			.attr('width', width+margin.left+margin.right)
			.attr('height', height+margin.top+margin.bottom)

			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// Axes.
		const x = D3.scaleLinear()
			.domain([0, lessonResults.length-1])
			.range([0, width]);

		const y = D3.scaleLinear()
			.domain([0, maximumY])
			.range([height, 0]);

		// Add the errors line.
		const errorLine = D3.line<Types.LessonResult>()
			.curve(D3.curveBasis)
			.x((d, i) => { return x(i); })
			.y((d) => { return y(d.errors); });

		svg.append('path')
			.datum(lessonResults)
			.attr('class', 'statistics-errors-line')
			.attr('d', errorLine);

		// Add the WPM line.
		const wpmLine = D3.line<Types.LessonResult>()
			.curve(D3.curveBasis)
			.x((d, i) => { return x(i); })
			.y((d) => { return y(d.wpm); });

		svg.append('path')
			.datum(lessonResults)
			.attr('class', 'statistics-wpm-line')
			.attr('d', wpmLine);

		// Tooltip.
		const tooltip = D3.select('#statistics-graph')
			.append('div')
			.style('opacity', 0)
			.attr('class', 'statistics-tooltip');

		const mouseover = (): void => { tooltip.style('opacity', 1); };
		const mouseleave = (): void => { tooltip.style('opacity', 0); };

		// Add the error points.
		svg.append('g')
			.selectAll('dot')
			.data(lessonResults)
			.enter()

			.append('circle')
			.attr('class', 'statistics-errors-point')
			.attr('cx', (d, i) => { return x(i); })
			.attr('cy', (d) => { return y(d.errors); })
			.attr('r', pointSize)

			.on('mouseover', mouseover)
			.on('mouseleave', mouseleave)
			.on('mousemove', (e: MouseEvent, d): void =>
			{
				tooltip.html(`${d.errors.toString()} Errors`)
					.style('left', `${e.clientX}px`)
					.style('top', `${e.clientY}px`);
			});

		// Add the WPM points.
		svg.append('g')
			.selectAll('dot')
			.data(lessonResults)
			.enter()

			.append('circle')
			.attr('class', 'statistics-wpm-point')
			.attr('cx', (d, i) => { return x(i); })
			.attr('cy', (d) => { return y(d.wpm); })
			.attr('r', pointSize)

			.on('mouseover', mouseover)
			.on('mouseleave', mouseleave)
			.on('mousemove', (e: MouseEvent, d): void =>
			{
				tooltip.html(`${d.wpm.toString()} WPM`)
					.style('left', `${e.clientX}px`)
					.style('top', `${e.clientY}px`);
			});
	}
}
