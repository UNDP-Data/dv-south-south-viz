/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MapArea } from './MapArea';
import { FormattedDataType, CountryGroupDataType } from '../Types';
import { BarChart } from './BarChart';
import { haveIntersection } from '../Utils/haveIntersection';
import { SDG_LIST } from '../Constants';
import { TreeMap } from './TreeMap';
import { CirclePacking } from './CirclePacking';
import { CircleBarChart } from './CircleBarChart';
import { GraphFooter } from '../Components/GraphFooter';

interface Props {
  data: FormattedDataType[];
  countryTaxonomy: CountryGroupDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  worldShape: any;
  filterBySDG: string[];
  filterByTheme: string[];
  regionList: string[];
  filterByApproach: string[];
  filterByPartners: string[];
  filterByRegions: string[];
  typologyFilter: string;
  methodFilter: string[];
  approachList: string[];
  methodList: string[];
  partnersList: string[];
}

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
    filterByRegions,
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
    methodFilter.length === 0
      ? dataFilteredByTypology
      : dataFilteredByTypology.filter(
          d => methodFilter.indexOf(d.Method) !== -1,
        );
  const dataFilteredByPartners =
    filterByPartners.length === 0
      ? dataFilteredByMethod
      : dataFilteredByMethod.filter(d =>
          haveIntersection(filterByPartners, d['Partners Involved']),
        );
  const dataFilteredByRegion =
    filterByRegions.length === 0
      ? dataFilteredByPartners
      : dataFilteredByPartners.filter(
          d => filterByRegions.indexOf(d['Regional Bureau']) !== -1,
        );
  const dataFilteredByApproach =
    filterByApproach.length === 0
      ? dataFilteredByRegion
      : dataFilteredByRegion.filter(d =>
          haveIntersection(filterByApproach, d['Approach used by UNDP']),
        );
  return (
    <div className='graph-el undp-scrollbar' style={{ height: '80vh' }}>
      <div className='padding-05 flex-div flex-column gap-05'>
        <div className='stat-card-container'>
          <div
            className='stat-card no-hover'
            style={{
              width: 'calc(25% - 0.75rem)',
              backgroundColor: 'var(--white)',
              flexBasis: 0,
            }}
          >
            <h3 style={{ color: 'var(--white)' }}>
              {dataFilteredByApproach.length}
            </h3>
            <p>Initiatives Utilized South-South and Triangular Cooperation</p>
          </div>
          <div
            className='stat-card no-hover'
            style={{
              width: 'calc(25% - 0.75rem)',
              backgroundColor: 'var(--white)',
              flexBasis: 0,
            }}
          >
            <h3 style={{ color: 'var(--white)' }}>
              {
                dataFilteredByApproach.filter(
                  d => d.Method === 'Country-To-Country',
                ).length
              }
            </h3>
            <p>Country-to-Country Exchanges</p>
          </div>
          <div
            className='stat-card no-hover'
            style={{
              width: 'calc(25% - 0.75rem)',
              backgroundColor: 'var(--white)',
              flexBasis: 0,
            }}
          >
            <h3 style={{ color: 'var(--white)' }}>
              {
                dataFilteredByApproach.filter(
                  d => d.Method === 'Regional' || d.Method === 'Inter-Regional',
                ).length
              }
            </h3>
            <p>Regional and Inter-Regional Collaboration</p>
          </div>
          <div
            className='stat-card no-hover'
            style={{
              width: 'calc(25% - 0.75rem)',
              backgroundColor: 'var(--white)',
              flexBasis: 0,
            }}
          >
            <h3 style={{ color: 'var(--white)' }}>
              {
                dataFilteredByApproach.filter(
                  d => !d['ISO-3 Code'] && d['Regional Bureau'] === 'Global',
                ).length
              }
            </h3>
            <p>Global Initiatives</p>
          </div>
        </div>
        <MapArea
          data={dataFilteredByApproach.filter(d => d['ISO-3 Code'])}
          countryTaxonomy={countryTaxonomy}
          worldShape={worldShape}
        />
        <div style={{ flexGrow: 1, backgroundColor: 'var(--white)' }}>
          <div className='padding-05'>
            <h5 className='undp-typography margin-bottom-05'>
              Initiatives by SDGs*
            </h5>
            <div style={{ height: '400px', minWidth: '800px' }}>
              <BarChart
                data={dataFilteredByApproach}
                regionList={SDG_LIST}
                columnID='SDG'
              />
            </div>
            <GraphFooter text='One initiative can have multiple SDGs' />
          </div>
        </div>
        <div className='flex-div flex-wrap gap-05'>
          <div
            style={{
              flexGrow: 1,
              width: 'calc(50% - 0.5rem)',
              backgroundColor: 'var(--white)',
            }}
          >
            <div className='padding-05'>
              <h5 className='undp-typography margin-bottom-05'>
                Initiatives by Regions Involved
              </h5>
              <div>
                <TreeMap
                  data={regionList.map(d => ({
                    region: d,
                    noOfInitiatives: dataFilteredByApproach.filter(
                      el => el['Regional Bureau'] === d,
                    ).length,
                  }))}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              flexGrow: 1,
              width: 'calc(50% - 0.5rem)',
              backgroundColor: 'var(--white)',
            }}
          >
            <div className='padding-05'>
              <h5 className='undp-typography margin-bottom-05'>
                Initiatives by Approach*
              </h5>
              <div style={{ height: '400px' }}>
                <CircleBarChart
                  data={dataFilteredByApproach}
                  regionList={approachList}
                  columnID='Approach used by UNDP'
                />
              </div>
              <GraphFooter text='One initiative can have multiple approaches' />
            </div>
          </div>
        </div>
        <div className='flex-div flex-wrap gap-05'>
          <div
            style={{
              flexGrow: 1,
              width: 'calc(50% - 0.5rem)',
              backgroundColor: 'var(--white)',
            }}
          >
            <div className='padding-05'>
              <h5 className='undp-typography margin-bottom-05'>
                Initiatives by Methods*
              </h5>
              <div>
                <CirclePacking
                  data={methodList.map(d => ({
                    region: d,
                    noOfInitiatives: dataFilteredByApproach.filter(
                      el => el.Method === d,
                    ).length,
                  }))}
                />
              </div>
              <GraphFooter text='One initiative can have multiple methods' />
            </div>
          </div>
          <div
            style={{
              flexGrow: 1,
              width: 'calc(50% - 0.5rem)',
              backgroundColor: 'var(--white)',
            }}
          >
            <div className='padding-05'>
              <h5 className='undp-typography margin-bottom-05'>
                Initiatives by Partners*
              </h5>
              <div>
                <CirclePacking
                  data={partnersList.map(d => ({
                    region: d,
                    noOfInitiatives: dataFilteredByApproach.filter(
                      el => el['Partners Involved'].indexOf(d) !== -1,
                    ).length,
                  }))}
                />
              </div>
              <GraphFooter text='One initiative can have multiple partners' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
