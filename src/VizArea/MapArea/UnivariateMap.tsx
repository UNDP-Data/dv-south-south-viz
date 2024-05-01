/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleThreshold } from 'd3-scale';
import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth } from 'd3-geo';
import {
  CountryGroupDataType,
  HoverDataType,
  CountryDataType,
} from '../../Types';
import { Tooltip } from '../../Components/Tooltip';

interface Props {
  data: CountryDataType[];
  worldShape: any;
  countryTaxonomy: CountryGroupDataType[];
  width: number;
  height: number;
}

const G = styled.g`
  pointer-events: none;
`;

export function UnivariateMap(props: Props) {
  const { data, countryTaxonomy, worldShape, width, height } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgWidth = 960;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = geoEqualEarth().rotate([0, 0]).scale(190).center([10, 10]);
  const valueArray = [2, 5, 7, 10, 15, 25];
  const colorArray = UNDPColorModule.sequentialColors.neutralColorsx07;
  const colorScale = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(colorArray);
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehavior = zoom()
      .scaleExtent([0.7, 12])
      .translateExtent([
        [-20, 0],
        [svgWidth + 20, svgHeight],
      ])
      .on('zoom', ({ transform }) => {
        setZoomLevel(transform.k);
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehavior as any);
  }, [svgHeight, svgWidth]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={mapSvg}
      >
        <rect y='-20' width={svgWidth} height={svgHeight + 40} fill='#fff' />
        <g ref={mapG}>
          {worldShape.features.map((d: any, i: number) => {
            if (d.properties.NAME === 'Antarctica') return null;
            return (
              <g key={i} opacity={!selectedColor ? 1 : 0.2}>
                {d.geometry.type === 'MultiPolygon'
                  ? d.geometry.coordinates.map((el: any, j: any) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [
                            number,
                            number,
                          ];
                          if (k !== geo.length - 1)
                            path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#999'
                          strokeWidth={0.2 / zoomLevel}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })
                  : d.geometry.coordinates.map((el: any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [
                          number,
                          number,
                        ];
                        if (k !== el.length - 1)
                          path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#999'
                          strokeWidth={0.2 / zoomLevel}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })}
              </g>
            );
          })}
          {data
            .filter(d => d['Alpha-3 code'] !== 'ATA')
            .map((d, i: number) => {
              const index = worldShape.features.findIndex(
                (el: any) => d['Alpha-3 code'] === el.properties.ISO3,
              );
              const val = d.noOfProjects;
              const color = val ? colorScale(val) : UNDPColorModule.graphNoData;

              return (
                <g
                  key={i}
                  opacity={
                    selectedColor ? (selectedColor === color ? 1 : 0.1) : 1
                  }
                  onMouseEnter={event => {
                    setHoverData({
                      country:
                        countryTaxonomy[
                          countryTaxonomy.findIndex(
                            el => el['Alpha-3 code'] === d['Alpha-3 code'],
                          )
                        ]['Country or Area'],
                      continent:
                        countryTaxonomy[
                          countryTaxonomy.findIndex(
                            el => el['Alpha-3 code'] === d['Alpha-3 code'],
                          )
                        ]['Group 1'],
                      noOfProjects: d.noOfProjects,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseMove={event => {
                    setHoverData({
                      country:
                        countryTaxonomy[
                          countryTaxonomy.findIndex(
                            el => el['Alpha-3 code'] === d['Alpha-3 code'],
                          )
                        ]['Country or Area'],
                      continent:
                        countryTaxonomy[
                          countryTaxonomy.findIndex(
                            el => el['Alpha-3 code'] === d['Alpha-3 code'],
                          )
                        ]['Group 1'],
                      noOfProjects: d.noOfProjects,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                >
                  {index === -1
                    ? null
                    : worldShape.features[index].geometry.type ===
                      'MultiPolygon'
                    ? worldShape.features[index].geometry.coordinates.map(
                        (el: any, j: any) => {
                          let masterPath = '';
                          el.forEach((geo: number[][]) => {
                            let path = ' M';
                            geo.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [
                                number,
                                number,
                              ];
                              if (k !== geo.length - 1)
                                path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            masterPath += path;
                          });
                          return (
                            <path
                              key={j}
                              d={masterPath}
                              stroke='#999'
                              strokeWidth={0.2 / zoomLevel}
                              fill={color}
                            />
                          );
                        },
                      )
                    : worldShape.features[index].geometry.coordinates.map(
                        (el: any, j: number) => {
                          let path = 'M';
                          el.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== el.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          return (
                            <path
                              key={j}
                              d={path}
                              stroke='#999'
                              strokeWidth={0.2 / zoomLevel}
                              fill={color}
                            />
                          );
                        },
                      )}
                </g>
              );
            })}
          {hoverData
            ? worldShape.features
                .filter(
                  (d: any) =>
                    d.properties.ISO3 ===
                    countryTaxonomy[
                      countryTaxonomy.findIndex(
                        el => el['Country or Area'] === hoverData?.country,
                      )
                    ]['Alpha-3 code'],
                )
                .map((d: any, i: number) => (
                  <G opacity={!selectedColor ? 1 : 0} key={i}>
                    {d.geometry.type === 'MultiPolygon'
                      ? d.geometry.coordinates.map((el: any, j: any) => {
                          let masterPath = '';
                          el.forEach((geo: number[][]) => {
                            let path = ' M';
                            geo.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [
                                number,
                                number,
                              ];
                              if (k !== geo.length - 1)
                                path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            masterPath += path;
                          });
                          return (
                            <path
                              key={j}
                              d={masterPath}
                              stroke='#212121'
                              opacity={1}
                              strokeWidth={1.5 / zoomLevel}
                              fillOpacity={0}
                              fill={UNDPColorModule.graphNoData}
                            />
                          );
                        })
                      : d.geometry.coordinates.map((el: any, j: number) => {
                          let path = 'M';
                          el.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== el.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          return (
                            <path
                              key={j}
                              d={path}
                              stroke='#212121'
                              opacity={1}
                              strokeWidth={1.5 / zoomLevel}
                              fillOpacity={0}
                              fill='none'
                            />
                          );
                        })}
                  </G>
                ))
            : null}
        </g>
      </svg>
      <div
        className='bivariate-legend-container'
        style={{ position: 'relative' }}
      >
        <div className='univariate-legend-el'>
          <div className='univariate-map-color-legend-element padding-00'>
            <div>
              <div
                className='univariate-map-legend-text'
                style={{ lineHeight: 'normal' }}
              >
                No. of initiative
              </div>
              <svg width='100%' viewBox='0 0 320 30'>
                <g>
                  {valueArray.map((d, i) => (
                    <g
                      key={i}
                      onMouseOver={() => {
                        setSelectedColor(colorArray[i]);
                      }}
                      onMouseLeave={() => {
                        setSelectedColor(undefined);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={(i * 320) / colorArray.length + 1}
                        y={1}
                        width={320 / colorArray.length - 2}
                        height={8}
                        fill={colorArray[i]}
                        stroke={
                          selectedColor === colorArray[i]
                            ? '#212121'
                            : colorArray[i]
                        }
                      />
                      <text
                        x={((i + 1) * 320) / colorArray.length}
                        y={25}
                        textAnchor='middle'
                        fontSize={12}
                        fill='#212121'
                        style={{
                          fontFamily: 'var(--fontFamily)',
                        }}
                      >
                        {d}
                      </text>
                    </g>
                  ))}
                  <g>
                    <rect
                      onMouseOver={() => {
                        setSelectedColor(colorArray[valueArray.length]);
                      }}
                      onMouseLeave={() => {
                        setSelectedColor(undefined);
                      }}
                      x={(valueArray.length * 320) / colorArray.length + 1}
                      y={1}
                      width={320 / colorArray.length - 2}
                      height={8}
                      fill={colorArray[valueArray.length]}
                      stroke={
                        selectedColor === colorArray[valueArray.length]
                          ? '#212121'
                          : colorArray[valueArray.length]
                      }
                      strokeWidth={1}
                      style={{ cursor: 'pointer' }}
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </>
  );
}
