import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FormattedDataType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: FormattedDataType[];
}

const GraphDiv = styled.div`
  flex-grow: 1;
  height: 25rem;
`;

export function BarChart(props: Props) {
  const { data } = props;

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
        <Graph data={data} svgWidth={svgWidth} svgHeight={svgHeight} />
      ) : null}
    </GraphDiv>
  );
}
