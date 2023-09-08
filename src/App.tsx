import { queue } from 'd3-queue';
import { csv, json } from 'd3-request';
import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import { Select, Switch } from 'antd';
import {
  CountryGroupDataType,
  DataTypeFromCSV,
  FormattedDataType,
} from './Types';
import { VizArea } from './VizArea';
import { SDG_LIST } from './Constants';

const FilterEl = styled.div`
  width: calc(33.33% - 2.33rem);
  min-width: 10rem;
  flex-grow: 1;
`;

const FilterContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--white);
  @media (max-width: 960px) {
    position: static;
  }
`;

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worldShape, setWorldShape] = useState<any>(undefined);
  const [rawData, setRawData] = useState<FormattedDataType[]>([]);
  const [thematicArea, setThematicArea] = useState<string[]>([]);
  const [filterByHost, setFilterByHost] = useState<string[]>([]);
  const [filterByProvider, setFilterByProvider] = useState<string[]>([]);
  const [filterByTheme, setFilterByTheme] = useState<string[]>([]);
  const [filterBySDG, setFilterBySDG] = useState<string[]>([]);
  const [regionList, setRegionList] = useState<string[]>([]);
  const [showPrivateSupport, setShowPrivateSupport] = useState(false);
  const [LDCsInvolved, setLDCsInvolved] = useState(false);
  const [countryTaxonomy, setCountryTaxonomy] = useState<
    CountryGroupDataType[]
  >([]);
  useEffect(() => {
    queue()
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/dv-world-map-geojson-data/main/worldMap.json',
      )
      .defer(
        csv,
        'https://raw.githubusercontent.com/UNDP-Data/dv-south-south-projects-mapping-viz/main/public/data.csv',
      )
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json',
      )
      .await(
        (
          err: unknown,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          worldShapeData: any,
          data: DataTypeFromCSV[],
          countryTaxonomyData: CountryGroupDataType[],
        ) => {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          if (err) throw err;
          setWorldShape(worldShapeData);
          setCountryTaxonomy(
            sortBy(countryTaxonomyData, d => d['Country or Area']),
          );
          const dataFormatted: FormattedDataType[] = data.map(d => ({
            ...d,
            Description: d.Description?.trim(),
            'Project Name': d['Project Name']?.trim(),
            'Start year': +d['Start year'],
            'End year':
              d['End year'] && d['End year'] !== ''
                ? +d['End year']
                : undefined,
            'Does it involve LDCs?': d['Does it involve LDCs?'] === 'YES',
            'UNDP as Donor': d['UNDP as Donor'] === 'YES',
            'UNDP as Implementor': d['UNDP as Implementor'] === 'YES',
            'Host/Recipient Country/ies': d['Host/Recipient Country/ies']
              .split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            'Provider Country/ies': d['Provider Country/ies']
              .split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            'Entity/ies Supporting and/or Implementing': d[
              'Entity/ies Supporting and/or Implementing'
            ]
              .split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            'Regions Involved': d['Regions Involved']
              .split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            Links: d.Links?.split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            'Is the private sector involved?':
              d['Is the private sector involved?'] === 'YES',
            'Thematic Areas': d['Thematic Areas']
              .split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            'Primary SDG Contribution': d['Primary SDG Contribution'].trim(),
            'Secondary SDG Contribution': d['Secondary SDG Contribution']
              .split(',')
              .filter(el => el && el !== '')
              .map(el => el.trim()),
            Number: +d.Number,
          }));
          setRawData(dataFormatted);
          const thematicAreaList = [
            ...new Set([
              ...new Set(
                dataFormatted
                  .map(d => d['Thematic Areas'])
                  .reduce((acc, curr) => acc.concat(curr), []),
              ),
            ]),
          ];
          const RegionList = [
            ...new Set([
              ...new Set(
                dataFormatted
                  .map(d => d['Regions Involved'])
                  .reduce((acc, curr) => acc.concat(curr), []),
              ),
            ]),
          ];
          setThematicArea(sortBy(thematicAreaList, d => d));
          setRegionList(sortBy(RegionList, d => d));
        },
      );
  }, []);

  return (
    <div className='undp-container'>
      {worldShape && rawData && countryTaxonomy && thematicArea ? (
        <div>
          <FilterContainer className='margin-bottom-05 padding-top-05 padding-bottom-05'>
            <div className='flex-div flex-wrap margin-bottom-05 gap-07'>
              <FilterEl>
                <div className='label'>Filter By Host Country</div>
                <Select
                  className='undp-select'
                  placeholder='All Host Countries'
                  mode='multiple'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    const countryID = countryTaxonomy
                      .filter(el => d.indexOf(el['Country or Area']) !== -1)
                      .map(el => el['Alpha-3 code']);
                    if (d.length === 0) setFilterByHost([]);
                    else setFilterByHost(countryID);
                  }}
                >
                  {countryTaxonomy.map(d => (
                    <Select.Option
                      className='undp-select-option'
                      key={d['Country or Area']}
                    >
                      {d['Country or Area']}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
              <FilterEl>
                <div className='label'>Filter By Provider Country</div>
                <Select
                  className='undp-select'
                  placeholder='All Provider Countries'
                  mode='multiple'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    const countryID = countryTaxonomy
                      .filter(el => d.indexOf(el['Country or Area']) !== -1)
                      .map(el => el['Alpha-3 code']);
                    if (d.length === 0) setFilterByProvider([]);
                    else setFilterByProvider(countryID);
                  }}
                >
                  {countryTaxonomy.map(d => (
                    <Select.Option
                      className='undp-select-option'
                      key={d['Country or Area']}
                    >
                      {d['Country or Area']}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
              <FilterEl>
                <div className='label'>
                  Only Show Project with LDCs Involved
                </div>
                <Switch
                  checked={LDCsInvolved}
                  className='undp-switch margin-top-03'
                  onChange={e => {
                    setLDCsInvolved(e);
                  }}
                />
              </FilterEl>
            </div>
            <div className='flex-div flex-wrap gap-07'>
              <FilterEl>
                <div className='label'>Filter By Thematic Area</div>
                <Select
                  className='undp-select'
                  placeholder='All Themes'
                  mode='multiple'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    setFilterByTheme(d || []);
                  }}
                >
                  {thematicArea.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
              <FilterEl>
                <div className='label'>Filter By SDGs</div>
                <Select
                  className='undp-select'
                  placeholder='All SDGs'
                  mode='multiple'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    setFilterBySDG(d || []);
                  }}
                >
                  {SDG_LIST.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
              <FilterEl>
                <div className='label'>
                  Only Show Project with Private Sector Support
                </div>
                <Switch
                  checked={showPrivateSupport}
                  className='undp-switch margin-top-03'
                  onChange={e => {
                    setShowPrivateSupport(e);
                  }}
                />
              </FilterEl>
            </div>
          </FilterContainer>
          <VizArea
            filterBySDG={filterBySDG}
            filterByTheme={filterByTheme}
            filterByHost={filterByHost}
            filterByProvider={filterByProvider}
            LDCsInvolved={LDCsInvolved}
            showPrivateSupport={showPrivateSupport}
            data={rawData}
            countryTaxonomy={countryTaxonomy}
            regionList={regionList}
            worldShape={worldShape}
          />
        </div>
      ) : (
        <div className='undp-loader-container undp-container'>
          <div className='undp-loader' />
        </div>
      )}
    </div>
  );
}

export default App;
