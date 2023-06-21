import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: number[];
  barList: string[];
  svgWidth: number;
  svgHeight: number;
}

export function HorizontalGraph(props: Props) {
  const { data, svgWidth, svgHeight, barList } = props;
  const margin = {
    top: 10,
    bottom: 10,
    left: 100,
    right: 30,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data);

  const xScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const yScale = scaleBand()
    .domain(barList)
    .range([0, graphHeight])
    .paddingInner(0.25);
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {barList.map((d, i) => {
          return (
            <g key={i}>
              <rect
                x={0}
                y={yScale(d)}
                width={xScale(data[i])}
                fill={UNDPColorModule.graphMainColor}
                height={yScale.bandwidth()}
              />
              <text
                x={0}
                y={(yScale(d) as number) + yScale.bandwidth() / 2}
                fontSize='14px'
                fontWeight='bold'
                textAnchor='end'
                fill='#110848'
                dx='-5px'
                dy={5}
              >
                {d}
              </text>
              <text
                x={xScale(data[i])}
                y={(yScale(d) as number) + yScale.bandwidth() / 2}
                fontSize='18px'
                fontWeight='bold'
                textAnchor='start'
                fill={UNDPColorModule.graphMainColor}
                dx='5px'
                dy={5}
              >
                {data[i]}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
