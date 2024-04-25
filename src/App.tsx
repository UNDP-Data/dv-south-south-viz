import { queue } from 'd3-queue';
import { csv, json } from 'd3-request';
import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import { Radio, Select } from 'antd';
import {
  CountryGroupDataType,
  DataTypeFromCSV,
  FormattedDataType,
} from './Types';
import { VizArea } from './VizArea';
import { REGION_NAME, SDG_LIST } from './Constants';

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
  const [filterByTheme, setFilterByTheme] = useState<string[]>([]);
  const [filterBySDG, setFilterBySDG] = useState<string[]>([]);
  const [filterByPartners, setFilterByPartners] = useState<string[]>([]);
  const [filterByApproach, setFilterByApproach] = useState<string | undefined>(
    undefined,
  );
  const [regionList, setRegionList] = useState<string[]>([]);
  const [methodList, setMethodList] = useState<string[]>([]);
  const [approachList, setApproachList] = useState<string[]>([]);
  const [partnersList, setPartnersList] = useState<string[]>([]);
  const [typologyFilter, setTypologyFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState<string | undefined>(
    undefined,
  );
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
        'https://raw.githubusercontent.com/UNDP-Data/dv-south-south-data-repo/main/data.csv',
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
            'Obs ID': d['Obs ID'],
            'Partners Involved': d['Partners Involved']
              .split(';')
              .map(el => el.trim()),
            'Regional Bureau':
              REGION_NAME[
                REGION_NAME.findIndex(
                  el => el.id === d['Regional Bureau'].trim(),
                )
              ].name,
            'ISO-3 Code': d['ISO-3 Code'] === '' ? undefined : d['ISO-3 Code'],
            Typology: d.Typology.split(';').map(el => el.trim()),
            'Approach used by UNDP': d['Approach used by UNDP']
              .split(';')
              .map(el => el.trim()),
            Method: d.Method.trim(),
            SDG: d.SDG.split(';')
              .map(el => `SDG${el}`)
              .map(el => el.trim()),
            'Thematic Area': d['Thematic Area'].split(';').map(el => el.trim()),
          }));
          setRawData(dataFormatted);
          const thematicAreaList = [
            ...new Set([
              ...new Set(
                dataFormatted
                  .map(d => d['Thematic Area'])
                  .reduce((acc, curr) => acc.concat(curr), []),
              ),
            ]),
          ];
          const partnersListTemp = [
            ...new Set([
              ...new Set(
                dataFormatted
                  .map(d => d['Partners Involved'])
                  .reduce((acc, curr) => acc.concat(curr), []),
              ),
            ]),
          ];
          const approachListTemp = [
            ...new Set([
              ...new Set(
                dataFormatted
                  .map(d => d['Approach used by UNDP'])
                  .reduce((acc, curr) => acc.concat(curr), []),
              ),
            ]),
          ];
          const methodListTemp = [
            ...new Set([...new Set(dataFormatted.map(d => d.Method))]),
          ].filter(d => d && d !== '');
          const RegionList = [
            ...new Set([...new Set(REGION_NAME.map(d => d.name))]),
          ];
          setThematicArea(sortBy(thematicAreaList, d => d));
          setRegionList(RegionList);
          setApproachList(sortBy(approachListTemp, d => d));
          setPartnersList(
            sortBy(partnersListTemp, d => d).filter(d => d && d !== ''),
          );
          setMethodList(sortBy(methodListTemp, d => d));
        },
      );
  }, []);

  return (
    <div className='undp-container'>
      {worldShape &&
      rawData &&
      countryTaxonomy &&
      thematicArea &&
      approachList &&
      partnersList ? (
        <div>
          <FilterContainer className='margin-bottom-05 padding-top-05 padding-bottom-05'>
            <div className='flex-div flex-wrap margin-bottom-05 gap-05'>
              <FilterEl>
                <p className='undp-typography label'>Filter by Typology</p>
                <Radio.Group
                  onChange={e => {
                    // eslint-disable-next-line no-console
                    setTypologyFilter(e.target.value);
                  }}
                  className='undp-button-radio'
                  value={typologyFilter}
                >
                  <Radio.Button value='All'>All</Radio.Button>
                  <Radio.Button value='LLDC'>LLDC</Radio.Button>
                  <Radio.Button value='LDC'>LDC</Radio.Button>
                  <Radio.Button value='SIDS'>SIDS</Radio.Button>
                </Radio.Group>
              </FilterEl>
              <FilterEl>
                <div className='label'>Filter By Methods</div>
                <Select
                  className='undp-select'
                  placeholder='All Methods'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    setMethodFilter(d);
                  }}
                >
                  {methodList.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
              <FilterEl>
                <div className='label'>Filter By Approaches</div>
                <Select
                  className='undp-select'
                  placeholder='All Approaches'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    setFilterByApproach(d);
                  }}
                >
                  {approachList.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
            </div>
            <div className='flex-div flex-wrap gap-05'>
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
                <div className='label'>Filter By Partners</div>
                <Select
                  className='undp-select'
                  placeholder='All Partners'
                  mode='multiple'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  onChange={d => {
                    setFilterByPartners(d || []);
                  }}
                >
                  {partnersList.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </FilterEl>
            </div>
          </FilterContainer>
          <VizArea
            filterBySDG={filterBySDG}
            filterByTheme={filterByTheme}
            filterByApproach={filterByApproach}
            filterByPartners={filterByPartners}
            typologyFilter={typologyFilter}
            methodFilter={methodFilter}
            data={rawData}
            countryTaxonomy={countryTaxonomy}
            regionList={regionList}
            worldShape={worldShape}
            approachList={approachList}
            methodList={methodList}
            partnersList={partnersList}
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
