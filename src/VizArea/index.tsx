/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styled from 'styled-components';
import { MapArea } from './MapArea';
import { FormattedDataType, CountryGroupDataType } from '../Types';
import { BarChart } from './BarChart';
import { haveIntersection } from '../Utils/haveIntersection';
import { SDG_LIST } from '../Constants';

interface Props {
  data: FormattedDataType[];
  countryTaxonomy: CountryGroupDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  worldShape: any;
  filterBySDG: string[];
  filterByTheme: string[];
  regionList: string[];
  filterByApproach?: string;
  filterByPartners: string[];
  typologyFilter: string;
  methodFilter?: string;
  approachList: string[];
  methodList: string[];
  partnersList: string[];
}

const El = styled.div`
  overflow: auto;
  position: relative;
  background-color: var(--gray-200);
  padding: var(--spacing-05);
`;

export function VizArea(props: Props) {
  const {
    data,
    countryTaxonomy,
    worldShape,
    filterBySDG,
    filterByTheme,
    regionList,
    filterByApproach,
    filterByPartners,
    typologyFilter,
    methodFilter,
    approachList,
    methodList,
    partnersList,
  } = props;
  const dataFilteredBySDGs =
    filterBySDG.length === 0
      ? data
      : data.filter(d => haveIntersection(filterBySDG, d.SDG));
  const dataFilteredByThemes =
    filterByTheme.length === 0
      ? dataFilteredBySDGs
      : dataFilteredBySDGs.filter(d =>
          haveIntersection(filterByTheme, d['Thematic Area']),
        );
  const dataFilteredByTypology =
    typologyFilter === 'All'
      ? dataFilteredByThemes
      : dataFilteredByThemes.filter(
          d => d.Typology.indexOf(typologyFilter) !== -1,
        );
  const dataFilteredByMethod =
    methodFilter === undefined
      ? dataFilteredByTypology
      : dataFilteredByTypology.filter(d => d.Method === methodFilter);
  const dataFilteredByPartners =
    filterByPartners.length === 0
      ? dataFilteredByMethod
      : dataFilteredByMethod.filter(d =>
          haveIntersection(filterByPartners, d['Partners Involved']),
        );
  const dataFilteredByApproach = !filterByApproach
    ? dataFilteredByPartners
    : dataFilteredByPartners.filter(
        d => d['Approach used by UNDP'].indexOf(filterByApproach) !== -1,
      );
  return (
    <div className='flex-div flex-column gap-05'>
      <div className='stat-card-container'>
        <div className='stat-card no-hover' style={{ width: '33.33%' }}>
          <h3>{dataFilteredByApproach.length}</h3>
          <p>Total No. of Initiatives</p>
        </div>
        <div className='stat-card no-hover' style={{ width: '33.33%' }}>
          <h3>{dataFilteredByApproach.filter(d => d['ISO-3 Code']).length}</h3>
          <p>Total No. of Country Initiatives</p>
        </div>
        <div className='stat-card no-hover' style={{ width: '33.33%' }}>
          <h3>{dataFilteredByApproach.filter(d => !d['ISO-3 Code']).length}</h3>
          <p>Total No. of Regional Initiatives</p>
        </div>
      </div>
      <MapArea
        data={dataFilteredByApproach.filter(d => d['ISO-3 Code'])}
        countryTaxonomy={countryTaxonomy}
        worldShape={worldShape}
      />
      <div className='flex-div flex-wrap gap-05'>
        <El className='undp-scrollbar' style={{ flexGrow: 2 }}>
          <h5 className='undp-typography margin-bottom-05'>
            Initiatives by SDGs
          </h5>
          <div style={{ height: '400px', minWidth: '800px' }}>
            <BarChart
              data={dataFilteredByApproach}
              type='SDGs'
              regionList={SDG_LIST}
              columnID='SDG'
            />
          </div>
        </El>
        <El className='undp-scrollbar' style={{ flexGrow: 1 }}>
          <h5 className='undp-typography margin-bottom-05'>
            Initiatives by Regions Involved
          </h5>
          <div style={{ height: '400px' }}>
            <BarChart
              data={dataFilteredByApproach}
              type='regions'
              regionList={regionList}
              columnID='Regional Bureau'
            />
          </div>
        </El>
      </div>
      <div className='flex-div flex-wrap gap-05'>
        <El className='undp-scrollbar' style={{ flexGrow: 1 }}>
          <h5 className='undp-typography margin-bottom-05'>
            Initiatives by Approach
          </h5>
          <div style={{ height: '400px' }}>
            <BarChart
              data={dataFilteredByApproach}
              type='approach'
              regionList={approachList}
              columnID='Approach used by UNDP'
            />
          </div>
        </El>
        <El className='undp-scrollbar' style={{ flexGrow: 1 }}>
          <h5 className='undp-typography margin-bottom-05'>
            Initiatives by Methods
          </h5>
          <div style={{ height: '400px' }}>
            <BarChart
              data={dataFilteredByApproach.filter(
                d => d.Method !== '' && d.Method,
              )}
              type='method'
              regionList={methodList}
              columnID='Method'
            />
          </div>
        </El>
        <El className='undp-scrollbar' style={{ flexGrow: 1 }}>
          <h5 className='undp-typography margin-bottom-05'>
            Initiatives by Partners
          </h5>
          <div style={{ height: '400px' }}>
            <BarChart
              data={dataFilteredByApproach}
              type='partners'
              regionList={partnersList}
              columnID='Partners Involved'
            />
          </div>
        </El>
      </div>
    </div>
  );
}
