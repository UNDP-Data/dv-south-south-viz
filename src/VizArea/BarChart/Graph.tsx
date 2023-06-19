import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import { FormattedDataType, SDGColorType } from '../../Types';
import { SDG_LIST } from '../../Constants';

interface Props {
  data: FormattedDataType[];
  svgWidth: number;
  svgHeight: number;
}

export function Graph(props: Props) {
  const { data, svgWidth, svgHeight } = props;
  const margin = {
    top: 90,
    bottom: 50,
    left: 20,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const noOfProjectsBySDGs = SDG_LIST.map(
    el =>
      data.filter(
        d =>
          el === d['Primary SDG Contribution'] ||
          d['Secondary SDG Contribution'].indexOf(el) !== -1,
      ).length,
  );

  const xMaxValue = Math.max(...noOfProjectsBySDGs);

  const heightScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([graphHeight, 0])
    .nice();
  const xScale = scaleBand()
    .domain(SDG_LIST)
    .range([0, graphWidth])
    .paddingInner(0.25);
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {SDG_LIST.map((d, i) => {
          return (
            <g key={i}>
              <rect
                x={xScale(d)}
                y={heightScale(noOfProjectsBySDGs[i])}
                width={xScale.bandwidth()}
                fill={
                  UNDPColorModule.sdgColors[d.toLowerCase() as SDGColorType]
                }
                height={Math.abs(
                  heightScale(noOfProjectsBySDGs[i]) - heightScale(0),
                )}
              />
              <text
                x={(xScale(d) as number) + xScale.bandwidth() / 2}
                y={heightScale(0)}
                fontSize='14px'
                fontWeight='bold'
                textAnchor='middle'
                fill='#110848'
                dy='15px'
              >
                {d}
              </text>
              <text
                x={(xScale(d) as number) + xScale.bandwidth() / 2}
                y={heightScale(noOfProjectsBySDGs[i])}
                fontSize='18px'
                fontWeight='bold'
                textAnchor='middle'
                fill={
                  UNDPColorModule.sdgColors[d.toLowerCase() as SDGColorType]
                }
                dy='-5px'
              >
                {noOfProjectsBySDGs[i]}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
