import * as d3 from 'd3'
import d3Tip from 'd3-tip'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([2003, 2018])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([1, 40])
  .range([height, 0])
const colorScale = d3
  .scaleOrdinal()
  .domain(['US', 'Russia', 'China'])
  .range(['blue', 'black', 'red'])

// Create a d3.line function

const line = d3
  .line()
  .x(d => xPositionScale(d.Year))
  .y(d => yPositionScale(d.visits))

d3.csv(require('../data/travels.csv')).then(ready)

// grouping

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints)
  console.log(nested)

  // first circles

  // svg
  // .selectAll('circle')
  // .data(datapoints)
  // .enter()
  // .append('circle')
  // .attr('fill', d => colorScale(d.country))
  // .attr('r', '5')
  // .attr('cx', d => {
  //   return xPositionScale(d.Year)
  // })
  // .attr('cy', d => {
  //  return yPositionScale(d.visits)
  // })

  // text

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('fill', d => colorScale(d.key))
    .attr('font-weight', 600)
    .text(d => d.key)
    .attr('x', 0)
    .attr('y', function(d) {
      console.log(d.values)
      const datapoints = d.values
      // Finds the first datapoint
      const finData = datapoints[datapoints.length - 16]

      // Use the yPositionScale and the value to position our text
      return yPositionScale(finData.visits)
    })
    .attr('font-size', 18)
    .attr('dx', 10)
    .attr('dy', 0)
    .attr('class', d => d.key)

    .on('mouseover', d => {
      console.log('hello')
      const className = d.key

      svg
        .selectAll('text.' + className)
        .attr('font-size', 25)
        .raise()
    })
    .on('mouseout', d => {
      const className = d.key
      svg.selectAll('text.' + className).attr('font-size', 15)
    })

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 3)
    .attr('stroke', d => colorScale(d.key))
    .attr('d', function(d) {
      console.log('this nested thing is', d)
      return line(d.values)
    })

    .attr('class', d => d.key)

    .on('mouseover', d => {
      console.log('hello')
      const className = d.key

      svg

        .selectAll('path.' + className)
        .attr('stroke-width', 8)
        .selectAll('text.' + className)
        .attr('font-size', 25)
        .raise()
    })
    .on('mouseout', d => {
      const className = d.key
      svg.selectAll('path.' + className).attr('stroke-width', 4)
    })
  // Axis

  const yAxis = d3.axisLeft(yPositionScale).tickPadding(0.5)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
