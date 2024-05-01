/* eslint-disable @typescript-eslint/no-explicit-any */
import { pack, stratify } from 'd3-hierarchy';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import { useState } from 'react';
import { TreeMapDataType } from '../../Types';

interface Props {
  data: TreeMapDataType[];
  width: number;
  height: number;
}

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}

interface MouseOverObj {
  value: string;
  xPosition: number;
  yPosition: number;
}
const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  font-size: 1rem;
  background-color: var(--gray-300);
  padding: var(--spacing-05);
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
  const { data, width, height } = props;
  const [hoveredData, setHoveredData] = useState<MouseOverObj | undefined>(
    undefined,
  );
  const treeMapData = [
    {
      region: 'root',
      parent: undefined,
      value: undefined,
    },
    ...data.map(d => ({
      region: d.region,
      value: d.noOfInitiatives,
      parent: 'root',
    })),
  ];
  const treeData = stratify()
    .id((d: any) => d.region)
    .parentId((d: any) => d.parent)(treeMapData);
  treeData.sum((d: any) => d.value);
  const treeMapVizData = pack().size([width, height]).padding(2)(treeData);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        {treeMapVizData.children?.map((d, i) => (
          <g
            key={i}
            transform={`translate(${d.x},${d.y})`}
            opacity={
              hoveredData
                ? hoveredData.value ===
                  `${(d.data as any).region}: ${(d.data as any).value}`
                  ? 1
                  : 0.4
                : 1
            }
            onMouseEnter={event => {
              setHoveredData({
                value: `${(d.data as any).region}: ${(d.data as any).value}`,
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseMove={event => {
              setHoveredData({
                value: `${(d.data as any).region}: ${(d.data as any).value}`,
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoveredData(undefined);
            }}
          >
            <circle
              key={i}
              cx={0}
              cy={0}
              r={d.r}
              fill={UNDPColorModule.graphMainColor}
            />
            {d.r > 25 ? (
              <text
                y={0}
                x={0}
                style={{
                  fill: 'var(--white)',
                  fontFamily: 'var(--fontFamily)',
                  textAnchor: 'middle',
                  fontWeight: 'bold',
                }}
                fontSize={14}
                dy={5}
              >
                {`${(d.data as any).region}`.length < d.r / 5
                  ? `${(d.data as any).region}`
                  : `${`${(d.data as any).region}`.substring(0, d.r / 5)}...`}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      {hoveredData ? (
        <TooltipEl
          x={hoveredData.xPosition}
          y={hoveredData.yPosition}
          verticalAlignment={
            hoveredData.yPosition > window.innerHeight / 2 ? 'top' : 'bottom'
          }
          horizontalAlignment={
            hoveredData.xPosition > window.innerWidth / 2 ? 'left' : 'right'
          }
        >
          {hoveredData.value}
        </TooltipEl>
      ) : null}
    </>
  );
}
