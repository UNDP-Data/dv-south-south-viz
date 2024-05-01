import { useState, useRef, useEffect } from 'react';
import { TreeMapDataType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: TreeMapDataType[];
}
export function TreeMap(props: Props) {
  const { data } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight((graphDiv.current.clientWidth * 3) / 4 || 190 * 3);
      setSvgWidth(graphDiv.current.clientWidth || 760);
    }
  }, [graphDiv?.current]);

  return (
    <div className='flex-div'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'fit-content',
          flexGrow: 1,
          margin: 'auto',
          padding: 0,
          backgroundColor: 'var(--white)',
        }}
        id='graph-id'
      >
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            lineHeight: 0,
          }}
          ref={graphDiv}
        >
          {svgWidth && svgHeight ? (
            <Graph data={data} width={svgWidth} height={svgHeight} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
