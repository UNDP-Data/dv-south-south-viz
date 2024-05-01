import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: number[];
  barList: string[];
  svgWidth: number;
  svgHeight: number;
}

export function Graph(props: Props) {
  const { data, svgWidth, svgHeight, barList } = props;
  const margin = {
    top: 90,
    bottom: 30,
    left: 20,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data);
  const xScale = scaleBand()
    .domain(barList)
    .range([0, graphWidth])
    .paddingInner(0.25);
  const radiusScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([0, xScale.bandwidth() / 2])
    .nice();
  return (
    <>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {barList.map((d, i) => {
            return (
              <g key={i}>
                <circle
                  cx={(xScale(d) as number) + xScale.bandwidth() / 2}
                  cy={graphHeight / 2}
                  r={radiusScale(data[i])}
                  fill={UNDPColorModule.graphMainColor}
                />
                <text
                  x={(xScale(d) as number) + xScale.bandwidth() / 2}
                  y={0}
                  fontSize='14px'
                  textAnchor='middle'
                  fill='#110848'
                  dy='15px'
                >
                  {d}
                </text>
                <text
                  x={(xScale(d) as number) + xScale.bandwidth() / 2}
                  y={graphHeight / 2}
                  fontSize='18px'
                  textAnchor='middle'
                  fill='#fff'
                  dy='5px'
                >
                  {data[i]}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <div />
    </>
  );
}
