import styled from 'styled-components';
import { FormattedDataType } from '../Types';
import { getSDGIcon } from '../Utils/GetSDGIcons';

interface Props {
  projectData: FormattedDataType;
}

const CardEl = styled.div`
  flex-grow: 1;
  font-size: 1.4rem;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

const DescriptionEl = styled.p`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
`;

export function ProjectCard(props: Props) {
  const { projectData } = props;
  return (
    <CardEl>
      <div style={{ padding: '1rem 1rem 0 1rem' }}>
        <h6 className='undp-typography'>{projectData['Project Name']}</h6>
        <DescriptionEl className='undp-typography small-font margin-bottom-04'>
          {projectData.Description}
        </DescriptionEl>
        <p className='small-font undp-typography bold margin-bottom-03 margin-top-03'>
          Thematic Area
        </p>
        <div className='flex-div flex-wrap margin-bottom-07 gap-03'>
          {projectData['Thematic Areas'].map((d, i) => (
            <div className='undp-chip' key={i}>
              {d}
            </div>
          ))}
          {projectData['Sub-thematic areas'].map((d, i) => (
            <div className='undp-chip' key={i}>
              {d}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '1rem 1rem 0 1rem' }}>
        <h6 className='undp-typography margin-top-00 margin-bottom-03'>SDGs</h6>
        <div className='flex-div flex-wrap'>
          {projectData['Primary SDG Contribution'] ? (
            <div>{getSDGIcon(projectData['Primary SDG Contribution'], 48)}</div>
          ) : null}
          {projectData['Secondary SDG Contribution'].length > 0 ? (
            <>
              {projectData['Secondary SDG Contribution']
                .filter(d => d !== projectData['Primary SDG Contribution'])
                .map((sdg, j) => (
                  <div key={j}>{getSDGIcon(sdg, 48)}</div>
                ))}
            </>
          ) : null}
        </div>
      </div>
    </CardEl>
  );
}
