import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import { useState } from 'react';
import { SDGColorType } from '../../Types';
import { SDG_VALUE } from '../../Constants';

interface Props {
  data: number[];
  barList: string[];
  svgWidth: number;
  svgHeight: number;
}

interface MouseOverObj {
  value: string;
  xPosition: number;
  yPosition: number;
}

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  font-size: 0.825rem;
  font-weight: bold;
  background-color: var(--gray-300);
  padding: var(--spacing-03);
  word-wrap: break-word;
  max-width: ${props =>
    props.horizontalAlignment === 'right'
      ? 'auto'
      : props.x < 470
      ? `${props.x - 60}px`
      : '470px'};
  top: ${props =>
    props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40}px;
  left: ${props =>
    props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20}px;
  transform: ${props =>
    `translate(${props.horizontalAlignment === 'left' ? '-100%' : '0%'},${
      props.verticalAlignment === 'top' ? '-100%' : '0%'
    })`};
`;

export function Graph(props: Props) {
  const { data, svgWidth, svgHeight, barList } = props;
  const margin = {
    top: 90,
    bottom: 30,
    left: 20,
    right: 20,
  };
  const [hoveredSDG, setHoveredSDG] = useState<MouseOverObj | undefined>(
    undefined,
  );
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data);

  const heightScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([graphHeight, 0])
    .nice();
  const xScale = scaleBand()
    .domain(barList)
    .range([0, graphWidth])
    .paddingInner(0.25);
  return (
    <>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {barList.map((d, i) => {
            return (
              <g
                key={i}
                opacity={
                  hoveredSDG ? (hoveredSDG.value === SDG_VALUE[i] ? 1 : 0.4) : 1
                }
                onMouseEnter={event => {
                  setHoveredSDG({
                    value: SDG_VALUE[i],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseMove={event => {
                  setHoveredSDG({
                    value: SDG_VALUE[i],
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredSDG(undefined);
                }}
              >
                <rect
                  x={xScale(d)}
                  y={heightScale(data[i])}
                  width={xScale.bandwidth()}
                  fill={
                    UNDPColorModule.sdgColors[d.toLowerCase() as SDGColorType]
                  }
                  height={Math.abs(heightScale(data[i]) - heightScale(0))}
                />
                <text
                  x={(xScale(d) as number) + xScale.bandwidth() / 2}
                  y={heightScale(0)}
                  fontSize='14px'
                  textAnchor='middle'
                  fill='#110848'
                  dy='15px'
                >
                  {d}
                </text>
                <text
                  x={(xScale(d) as number) + xScale.bandwidth() / 2}
                  y={heightScale(data[i])}
                  fontSize='18px'
                  textAnchor='middle'
                  fill={
                    UNDPColorModule.sdgColors[d.toLowerCase() as SDGColorType]
                  }
                  dy='-5px'
                >
                  {data[i]}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {hoveredSDG ? (
        <TooltipEl
          x={hoveredSDG.xPosition}
          y={hoveredSDG.yPosition}
          verticalAlignment={
            hoveredSDG.yPosition > window.innerHeight / 2 ? 'top' : 'bottom'
          }
          horizontalAlignment={
            hoveredSDG.xPosition > window.innerWidth / 2 ? 'left' : 'right'
          }
        >
          {hoveredSDG.value}
        </TooltipEl>
      ) : null}
      <div />
    </>
  );
}
