import styled from 'styled-components';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
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
  showHost: boolean;
  showProvider: boolean;
  filterByProvider: string[];
  filterByHost: string[];
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

const SettingEl = styled.div`
  width: calc(100% - 2.5rem);
  padding: 1.25rem;
  margin-top: 1.25rem;
  margin-left: 1.25rem;
  background-color: rgba(255, 255, 255, 0.6);
  @media (min-width: 820px) {
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: var(--shadow);
    min-width: 340px;
    width: calc(25% + 2.5rem);
    margin-top: 1.25rem;
    margin-left: 0;
    position: absolute;
    top: 2.5rem;
    left: 1.25rem;
    top: 0;
    z-index: 2;
  }
`;

export function MapArea(props: Props) {
  const {
    data,
    worldShape,
    countryTaxonomy,
    showHost,
    showProvider,
    filterByProvider,
    filterByHost,
  } = props;
  const [selectedOption, setSelectedOption] = useState<
    | 'No. of Projects As Host Countries'
    | 'No. of Projects As Provider Countries'
  >('No. of Projects As Host Countries');

  const options = [
    'No. of Projects As Host Countries',
    'No. of Projects As Provider Countries',
  ];

  const countryData: CountryDataType[] = countryTaxonomy.map(d => ({
    ...d,
    noOfProjectAsHost: data.filter(
      el => el['Host/Recipient Country/ies'].indexOf(d['Alpha-3 code']) !== -1,
    ).length,
    noOfProjectAsProvider: data.filter(
      el => el['Provider Country/ies'].indexOf(d['Alpha-3 code']) !== -1,
    ).length,
  }));

  useEffect(() => {
    if (!showHost && showProvider)
      setSelectedOption('No. of Projects As Provider Countries');
    if (!showProvider && showHost)
      setSelectedOption('No. of Projects As Host Countries');
  }, [showHost, showProvider]);
  return (
    <El id='graph-node'>
      <SettingEl>
        <div
          className='margin-bottom-05'
          style={{ width: '100%', minWidth: '19rem' }}
        >
          <p className='label'>Select Indicator</p>
          <Select
            className='undp-select'
            placeholder='Please select'
            value={selectedOption}
            onChange={d => {
              setSelectedOption(d);
            }}
            disabled={!showHost || !showProvider}
          >
            {options.map(d => (
              <Select.Option className='undp-select-option' key={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
      </SettingEl>
      <UnivariateMap
        data={countryData}
        selectedOption={selectedOption}
        worldShape={worldShape}
        countryTaxonomy={countryTaxonomy}
        filterByProvider={filterByProvider}
        filterByHost={filterByHost}
      />
    </El>
  );
}
