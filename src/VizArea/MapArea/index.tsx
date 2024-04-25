import styled from 'styled-components';
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

const El = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
  background-color: var(--black-200);
  @media (min-width: 961px) {
    height: 740px;
  }
  @media (max-width: 960px) {
    width: 100%;
  }
`;

export function MapArea(props: Props) {
  const { data, worldShape, countryTaxonomy } = props;

  const countryData: CountryDataType[] = countryTaxonomy.map(d => ({
    ...d,
    noOfProjects: data.filter(el => el['ISO-3 Code'] === d['Alpha-3 code'])
      .length,
  }));

  return (
    <El id='graph-node'>
      <UnivariateMap
        data={countryData}
        worldShape={worldShape}
        countryTaxonomy={countryTaxonomy}
      />
    </El>
  );
}
