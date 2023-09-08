/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styled from 'styled-components';
import { useState } from 'react';
import { Input, Modal } from 'antd';
import { MapArea } from './MapArea';
import { FormattedDataType, CountryGroupDataType } from '../Types';
import { BarChart } from './BarChart';
import { ProjectCard } from '../Components/ProjectCards';
import { getSDGIcon } from '../Utils/GetSDGIcons';

interface Props {
  data: FormattedDataType[];
  countryTaxonomy: CountryGroupDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  worldShape: any;
  filterBySDG: string[];
  filterByTheme: string[];
  filterByProvider: string[];
  filterByHost: string[];
  regionList: string[];
  LDCsInvolved: boolean;
  showPrivateSupport: boolean;
}

const El = styled.div`
  overflow: auto;
  position: relative;
  background-color: var(--gray-200);
  padding: var(--spacing-05);
`;

const ProjectCardContainer = styled.div`
  width: calc(20% - 0.8rem - 2px);
  min-width: min(100%, 320px);
  color: var(--black);
  text-decoration: none;
  background-color: var(--gray-100);
  align-items: stretch;
  display: flex;
  border: 1px solid var(--gray-300);
  cursor: pointer;
  @media (min-width: 888px) {
    width: calc(50% - 0.5rem - 2px);
  }
  @media (min-width: 320px) {
    width: calc(100% - 2px);
  }
  @media (min-width: 704px) {
    width: calc(50% - 0.5rem - 2px);
  }
  @media (min-width: 1312px) {
    width: calc(33.3% - 0.67rem - 2px);
  }
  @media (min-width: 1440px) {
    width: calc(25% - 0.75rem - 2px);
  }
  @media (min-width: 2196px) {
    width: calc(20% - 0.8rem - 2px);
  }
  &:hover {
    background-color: var(--gray-400);
  }
`;

export function VizArea(props: Props) {
  const {
    data,
    countryTaxonomy,
    worldShape,
    filterByHost,
    filterByProvider,
    filterBySDG,
    filterByTheme,
    showPrivateSupport,
    LDCsInvolved,
    regionList,
  } = props;
  const [clickedProject, setClickedProject] = useState<
    undefined | FormattedDataType
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<undefined | string>(undefined);
  const dataFilteredByHost =
    filterByHost.length === 0
      ? data
      : data.filter(d =>
          d['Host/Recipient Country/ies'].some(item =>
            filterByHost.includes(item),
          ),
        );
  const dataFilteredByProvider =
    filterByProvider.length === 0
      ? dataFilteredByHost
      : dataFilteredByHost.filter(d =>
          d['Provider Country/ies'].some(item =>
            filterByProvider.includes(item),
          ),
        );
  const dataFilteredBySDGs =
    filterBySDG.length === 0
      ? dataFilteredByProvider
      : dataFilteredByProvider.filter(
          d =>
            filterBySDG.indexOf(d['Primary SDG Contribution'] || 'No SDG') !==
              -1 ||
            d['Secondary SDG Contribution'].some(item =>
              filterBySDG.includes(item),
            ),
        );
  const dataFilteredByThemes =
    filterByTheme.length === 0
      ? dataFilteredBySDGs
      : dataFilteredBySDGs.filter(d =>
          d['Thematic Areas'].some(item => filterByTheme.includes(item)),
        );
  const dataFilteredByPrivateSector = !showPrivateSupport
    ? dataFilteredByThemes
    : dataFilteredByThemes.filter(d => d['Is the private sector involved?']);
  const dataFilteredByLDCsInvolvement = !LDCsInvolved
    ? dataFilteredByPrivateSector
    : dataFilteredByPrivateSector.filter(d => d['Does it involve LDCs?']);
  const hostCountryList = [
    ...new Set(
      dataFilteredByLDCsInvolvement
        .map(d => d['Host/Recipient Country/ies'])
        .reduce((acc, curr) => acc.concat(curr), []),
    ),
  ];
  const providerCountryList = [
    ...new Set(
      dataFilteredByLDCsInvolvement
        .map(d => d['Provider Country/ies'])
        .reduce((acc, curr) => acc.concat(curr), []),
    ),
  ];
  return (
    <div>
      <div className='stat-card-container margin-bottom-05'>
        <div className='stat-card no-hover' style={{ width: '33.33%' }}>
          <h3>{dataFilteredByLDCsInvolvement.length}</h3>
          <p>No. of Projects</p>
        </div>
        {filterByHost.length > 0 ? null : (
          <div className='stat-card no-hover' style={{ width: '33.33%' }}>
            <h3>{hostCountryList.length}</h3>
            <p>No. of host countries</p>
          </div>
        )}
        {filterByProvider.length > 0 ? null : (
          <div className='stat-card no-hover' style={{ width: '33.33%' }}>
            <h3>{providerCountryList.length}</h3>
            <p>No. of provider countries</p>
          </div>
        )}
      </div>
      {filterByHost.length > 0 && filterByProvider.length > 0 ? null : (
        <MapArea
          data={dataFilteredByLDCsInvolvement}
          countryTaxonomy={countryTaxonomy}
          worldShape={worldShape}
          showHost={filterByHost.length === 0}
          showProvider={filterByProvider.length === 0}
          filterByProvider={filterByProvider}
          filterByHost={filterByHost}
        />
      )}
      <div className='flex-div flex-wrap gap-07'>
        <El className='undp-scrollbar margin-top-07' style={{ flexGrow: 2 }}>
          <h5 className='undp-typography bold margin-bottom-05'>
            Projects by SDGs
          </h5>
          <div style={{ height: '400px', minWidth: '800px' }}>
            <BarChart
              data={dataFilteredByLDCsInvolvement}
              type='SDGs'
              regionList={regionList}
            />
          </div>
        </El>
        <El className='undp-scrollbar margin-top-07' style={{ flexGrow: 1 }}>
          <h5 className='undp-typography bold margin-bottom-05'>
            Projects by Regions Involved
          </h5>
          <div style={{ height: '400px' }}>
            <BarChart
              data={dataFilteredByLDCsInvolvement}
              type='regions'
              regionList={regionList}
            />
          </div>
        </El>
      </div>
      <div
        className='margin-top-07'
        style={{
          backgroundColor: 'var(--gray-200)',
          padding: 'var(--spacing-05)',
        }}
      >
        <h5 className='undp-typography bold margin-bottom-05'>
          All Projects ({dataFilteredByLDCsInvolvement.length})
        </h5>
        <Input
          placeholder='Search users'
          className='undp-input margin-bottom-07'
          size='large'
          value={searchQuery}
          onChange={d => {
            setSearchQuery(d.target.value);
          }}
        />
        <div className='flex-div flex-wrap'>
          {dataFilteredByLDCsInvolvement.filter(d =>
            searchQuery
              ? d.Description.toLowerCase().includes(
                  searchQuery?.toLowerCase(),
                ) ||
                d['Project Name']
                  .toLowerCase()
                  .includes(searchQuery?.toLowerCase())
              : d,
          ).length === 0 ? (
            <div
              className='bold'
              style={{
                padding: 'var(--spacing-07)',
                backgroundColor: 'var(--gray-300)',
                textAlign: 'center',
                width: 'calc(100% - 4rem)',
              }}
            >
              No Projects available with the selected criteria
            </div>
          ) : null}
          {dataFilteredByLDCsInvolvement
            .filter(d =>
              searchQuery
                ? d.Description.toLowerCase().includes(
                    searchQuery?.toLowerCase(),
                  ) ||
                  d['Project Name']
                    .toLowerCase()
                    .includes(searchQuery?.toLowerCase())
                : d,
            )
            .map((d, i) => (
              <ProjectCardContainer
                key={i}
                onClick={() => {
                  setClickedProject(d);
                }}
              >
                <ProjectCard projectData={d} />
              </ProjectCardContainer>
            ))}
        </div>
      </div>
      <Modal
        open={clickedProject !== undefined}
        className='undp-modal'
        title={clickedProject?.['Project Name']}
        onOk={() => {
          setClickedProject(undefined);
        }}
        onCancel={() => {
          setClickedProject(undefined);
        }}
        width='75%'
      >
        <h6 className='undp-typography'>
          {clickedProject?.['Start year']} -{' '}
          {clickedProject?.['End year'] || 'Present'}
        </h6>
        <p className='undp-typography small-font'>
          {clickedProject?.Description}
        </p>
        <hr className='undp-style margin-top-07 light' />
        <h6 className='undp-typography margin-top-07'>Thematic Areas</h6>
        {clickedProject ? (
          <div className='flex-div flex-wrap margin-bottom-05 gap-03'>
            {clickedProject['Thematic Areas'].map((d, i) => (
              <div className='undp-chip' key={i}>
                {d}
              </div>
            ))}
          </div>
        ) : null}
        <hr className='undp-style margin-top-07 light' />
        <h6 className='undp-typography margin-top-07'>SDGs</h6>
        {clickedProject ? (
          <div className='flex-div flex-wrap margin-bottom-05'>
            {clickedProject['Primary SDG Contribution'] &&
            clickedProject['Primary SDG Contribution'] !== '' ? (
              <div>
                {getSDGIcon(clickedProject['Primary SDG Contribution'], 48)}
              </div>
            ) : null}
            {clickedProject['Secondary SDG Contribution'].length > 0 ? (
              <>
                {clickedProject['Secondary SDG Contribution']
                  .filter(d => d !== clickedProject['Primary SDG Contribution'])
                  .map((sdg, j) => (
                    <div key={j}>{getSDGIcon(sdg, 48)}</div>
                  ))}
              </>
            ) : null}
          </div>
        ) : null}
        <hr className='undp-style margin-top-07 light' />
        <h6 className='undp-typography margin-top-07'>Host Countries</h6>
        {clickedProject ? (
          <div className='flex-div flex-wrap margin-bottom-05 gap-03'>
            {clickedProject['Host/Recipient Country/ies'].map((d, i) => (
              <div className='undp-chip' key={i}>
                {countryTaxonomy.findIndex(el => el['Alpha-3 code'] === d) !==
                -1
                  ? countryTaxonomy[
                      countryTaxonomy.findIndex(el => el['Alpha-3 code'] === d)
                    ]['Country or Area']
                  : d}
              </div>
            ))}
          </div>
        ) : null}
        <hr className='undp-style margin-top-07 light' />
        <h6 className='undp-typography margin-top-07'>Provider Countries</h6>
        {clickedProject ? (
          <div className='flex-div flex-wrap margin-bottom-05 gap-03'>
            {clickedProject['Provider Country/ies'].map((d, i) => (
              <div className='undp-chip' key={i}>
                {countryTaxonomy.findIndex(el => el['Alpha-3 code'] === d) !==
                -1
                  ? countryTaxonomy[
                      countryTaxonomy.findIndex(el => el['Alpha-3 code'] === d)
                    ]['Country or Area']
                  : d}
              </div>
            ))}
          </div>
        ) : null}
        <hr className='undp-style margin-top-07 margin-bottom-07 light' />
        <div className='flex-div flex-wrap'>
          <div
            style={{
              width: 'calc(50% - 0.5rem)',
              flexGrow: 1,
              minWidth: '20rem',
            }}
          >
            <h6 className='undp-typography'>Is UNDP a Donor</h6>
            {clickedProject ? (
              <div className='flex-div gap-03 flex-wrap margin-bottom-05 undp-chip flex-vert-align-center'>
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: clickedProject['UNDP as Donor']
                      ? 'var(--dark-green)'
                      : 'var(--dark-red)',
                  }}
                />
                {clickedProject['UNDP as Donor'] ? 'Yes' : 'No'}
              </div>
            ) : null}
          </div>
          <div
            style={{
              width: 'calc(50% - 0.5rem)',
              flexGrow: 1,
              minWidth: '20rem',
            }}
          >
            <h6 className='undp-typography'>Is UNDP an Implementor</h6>
            {clickedProject ? (
              <div className='flex-div gap-03 flex-wrap margin-bottom-05 undp-chip flex-vert-align-center'>
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: clickedProject['UNDP as Implementor']
                      ? 'var(--dark-green)'
                      : 'var(--dark-red)',
                  }}
                />
                {clickedProject['UNDP as Implementor'] ? 'Yes' : 'No'}
              </div>
            ) : null}
          </div>
          <div
            style={{
              width: 'calc(50% - 0.5rem)',
              flexGrow: 1,
              minWidth: '20rem',
            }}
          >
            <h6 className='undp-typography'>Is Private Sector Involved</h6>
            {clickedProject ? (
              <div className='flex-div gap-03 flex-wrap margin-bottom-05 undp-chip flex-vert-align-center'>
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: clickedProject[
                      'Is the private sector involved?'
                    ]
                      ? 'var(--dark-green)'
                      : 'var(--dark-red)',
                  }}
                />
                {clickedProject['Is the private sector involved?']
                  ? 'Yes'
                  : 'No'}
              </div>
            ) : null}
          </div>
          <div
            style={{
              width: 'calc(50% - 0.5rem)',
              flexGrow: 1,
              minWidth: '20rem',
            }}
          >
            <h6 className='undp-typography'>Are LDCs Involved</h6>
            {clickedProject ? (
              <div className='flex-div gap-03 flex-wrap margin-bottom-05 undp-chip flex-vert-align-center'>
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: clickedProject['Does it involve LDCs?']
                      ? 'var(--dark-green)'
                      : 'var(--dark-red)',
                  }}
                />
                {clickedProject['Does it involve LDCs?'] ? 'Yes' : 'No'}
              </div>
            ) : null}
          </div>
        </div>
        <hr className='undp-style margin-top-07 light' />
        <h6 className='undp-typography margin-top-07'>
          Entities Supporting / Implementing
        </h6>
        {clickedProject ? (
          <div className='flex-div flex-wrap margin-bottom-05 gap-03'>
            {clickedProject['Entity/ies Supporting and/or Implementing'].map(
              (d, i) => (
                <div className='undp-chip' key={i}>
                  {d}
                </div>
              ),
            )}
          </div>
        ) : null}
        <hr className='undp-style margin-top-07 light' />
        <h6 className='undp-typography margin-top-07'>Links</h6>
        {clickedProject ? (
          <div className='margin-bottom-05'>
            {clickedProject.Links.map((d, i) => (
              <a
                href={d}
                target='_blank'
                className='undp-style'
                key={i}
                rel='noreferrer'
              >
                {d}
              </a>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
