import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FormattedDataType } from '../../Types';
import { Graph } from './Graph';
import { SDG_LIST } from '../../Constants';
import { HorizontalGraph } from './HorizontalGraph';

interface Props {
  data: FormattedDataType[];
  type: 'regions' | 'SDGs';
  regionList: string[];
}

const GraphDiv = styled.div`
  flex-grow: 1;
  height: 25rem;
`;

export function BarChart(props: Props) {
  const { data, type, regionList } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv]);
  return (
    <GraphDiv ref={graphDiv}>
      {svgHeight && svgWidth ? (
        <div>
          {type === 'SDGs' ? (
            <Graph
              data={SDG_LIST.map(
                el =>
                  data.filter(
                    d =>
                      el === d['Primary SDG Contribution'] ||
                      d['Secondary SDG Contribution'].indexOf(el) !== -1,
                  ).length,
              )}
              barList={SDG_LIST}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
            />
          ) : (
            <HorizontalGraph
              data={regionList.map(
                el =>
                  data.filter(d => d['Regions Involved'].indexOf(el) !== -1)
                    .length,
              )}
              barList={regionList}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
            />
          )}
        </div>
      ) : null}
    </GraphDiv>
  );
}
