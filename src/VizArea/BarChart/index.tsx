import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FormattedDataType } from '../../Types';
import { Graph } from './Graph';
import { HorizontalGraph } from './HorizontalGraph';

interface Props {
  data: FormattedDataType[];
  type: 'regions' | 'SDGs' | 'approach' | 'method' | 'partners';
  regionList: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnID: any;
}

const GraphDiv = styled.div`
  flex-grow: 1;
  height: 25rem;
`;

export function BarChart(props: Props) {
  const { data, type, regionList, columnID } = props;

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
          {type === 'SDGs' || type === 'method' ? (
            <Graph
              data={regionList.map(
                el =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data.filter(d => (d as any)[columnID].indexOf(el) !== -1)
                    .length,
              )}
              barList={regionList}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              isSDG={type === 'SDGs'}
            />
          ) : (
            <HorizontalGraph
              data={regionList.map(
                el =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data.filter(d => (d as any)[columnID].indexOf(el) !== -1)
                    .length,
              )}
              barList={regionList}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              split
            />
          )}
        </div>
      ) : null}
    </GraphDiv>
  );
}
