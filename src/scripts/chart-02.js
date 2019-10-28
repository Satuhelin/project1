// UUSI

import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 50, left: 170, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 40])
  .range([0, width])
const yPositionScale = d3
  .scaleBand()
  .padding(0.2)
  .domain([
    'Kazakhstan',
    'Belarus',
    'Ukraine',
    'Germany',
    'France',
    'Tajikistan',
    'Italy',
    "People's Republic of China",
    'Turkey',
    'Kyrgyzstan'
  ])
  .range([0, height])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset(function() {
    return [20, this.getBBox().width * 0.6]
  })
  .html(function(d) {
    return `<span style='color:black'>${d.location}</span>`
  })
svg.call(tip)

d3.csv(require('../data/Russia10_2.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('fill', 'grey')
    .attr('stroke', 'black')
    .attr('height', 20)
    .attr('width', d => {
      return xPositionScale(d.location)
    })
    .attr('y', d => {
      return yPositionScale(d.country)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const yAxis = d3.axisLeft(yPositionScale).ticks(10)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .style('font-size', 20)

    .call(yAxis)

  const xAxis = d3.axisBottom(xPositionScale).ticks(7)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
