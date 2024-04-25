import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: number[];
  barList: string[];
  svgWidth: number;
  svgHeight: number;
  split?: boolean;
}

export function HorizontalGraph(props: Props) {
  const { data, svgWidth, svgHeight, barList, split } = props;
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
              {!split ? (
                d === 'Europe and Central Asia' ? (
                  <>
                    <text
                      x={0}
                      y={(yScale(d) as number) + yScale.bandwidth() / 2}
                      fontSize='14px'
                      textAnchor='end'
                      fill='#110848'
                      dx='-5px'
                      dy={-2.5}
                    >
                      Europe &
                    </text>
                    <text
                      x={0}
                      y={(yScale(d) as number) + yScale.bandwidth() / 2}
                      fontSize='14px'
                      textAnchor='end'
                      fill='#110848'
                      dx='-5px'
                      dy={12.5}
                    >
                      Central Asia
                    </text>
                  </>
                ) : d === 'Latin America and Caribbeans' ? (
                  <>
                    <text
                      x={0}
                      y={(yScale(d) as number) + yScale.bandwidth() / 2}
                      fontSize='14px'
                      textAnchor='end'
                      fill='#110848'
                      dx='-5px'
                      dy={-2.5}
                    >
                      Latin America
                    </text>
                    <text
                      x={0}
                      y={(yScale(d) as number) + yScale.bandwidth() / 2}
                      fontSize='14px'
                      textAnchor='end'
                      fill='#110848'
                      dx='-5px'
                      dy={12.5}
                    >
                      & Caribbeans
                    </text>
                  </>
                ) : (
                  <text
                    x={0}
                    y={(yScale(d) as number) + yScale.bandwidth() / 2}
                    fontSize='14px'
                    textAnchor='end'
                    fill='#110848'
                    dx='-5px'
                    dy={5}
                  >
                    {d}
                  </text>
                )
              ) : (
                <>
                  <text
                    x={0}
                    y={(yScale(d) as number) + yScale.bandwidth() / 2}
                    fontSize='14px'
                    textAnchor='end'
                    fill='#110848'
                    dx='-5px'
                    dy={-2.5}
                  >
                    {d.split(' ')[0]}
                  </text>
                  <text
                    x={0}
                    y={(yScale(d) as number) + yScale.bandwidth() / 2}
                    fontSize='14px'
                    textAnchor='end'
                    fill='#110848'
                    dx='-5px'
                    dy={12.5}
                  >
                    {d.split(' ')[1]}
                  </text>
                </>
              )}
              <text
                x={xScale(data[i])}
                y={(yScale(d) as number) + yScale.bandwidth() / 2}
                fontSize='18px'
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
