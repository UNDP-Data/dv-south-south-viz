import { useState, useRef, useEffect } from 'react';
import {
  CountryDataType,
  CountryGroupDataType,
  FormattedDataType,
} from '../../Types';
import { UnivariateMap } from './UnivariateMap';

interface Props {
  data: FormattedDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  worldShape: any;
  countryTaxonomy: CountryGroupDataType[];
}
export function MapArea(props: Props) {
  const { data, worldShape, countryTaxonomy } = props;

  const countryData: CountryDataType[] = countryTaxonomy.map(d => ({
    ...d,
    noOfProjects: data.filter(el => el['ISO-3 Code'] === d['Alpha-3 code'])
      .length,
  }));

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 570);
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
            <UnivariateMap
              data={countryData}
              worldShape={worldShape}
              countryTaxonomy={countryTaxonomy}
              width={svgWidth}
              height={svgHeight}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
