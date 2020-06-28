import React, { Component } from 'react'
import ReactMapboxGl, { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl';
import * as topojson from 'topojson-client';
import Sidebar from './Sidebar'
import Legend from './Legend'
import bbox from '@turf/bbox'
import geojsonTest from './data/geojsons/region2wTaxCompleteness.json'
import islands from './data/geojsons/islands.geojson'
import _ from 'lodash'
import * as d3 from 'd3'
import taxList from './data/glonaf/tax-list-filter1.txt'
import { bigFill, smallFill, circleFill, fillColorScheme } from './mapUtils'

const { token, styles, centers, colors } = require('./data/config.json')

const Map = ReactMapboxGl({
    accessToken: token
})


export default class MyMap extends Component {
    constructor(props) {

        super(props)

        this.state = {
            tdwg4_name: 'Hover for',
            county: 'Information',
            center: {
                lng: -13, //7.91
                lat: 32 //50.85
            },
            mapStyle: styles.mySimpleStyle,
            geojsonData: this.getGeojson(),
            islands: islands,
            zoom: [1.5],
            map: null,
            regionData: null,
            bigFilter: ['any',
                ['>=', 'GeodAREA', 1639],
                ['==', 'island', 0]
            ],
            smallFilter: ['all', ['<', 'GeodAREA', 1639], ['==', 'island', 1]],
            taxList: [],
            matching: [],
            inventoryView: false,
            inventoryButton: 'Inventory Completeness'

        }

        this.onClickFill = this.onClickFill.bind(this);
        this.onEnter = this.onEnter.bind(this)
        this.onExit = this.onExit.bind(this)
        this.handleButton = this.handleButton.bind(this)
        this.addDensPop = this.addDensPop.bind(this)
        this.addCompleteness = this.addCompleteness.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
        this.handlePlantDrop = this.handlePlantDrop.bind(this);
    }


    loadStyle(map) {

        /*  this.setState({
              map: map
          }) */

        const self = this;
        d3.dsv('\t', taxList).then((data) => {
            self.setState({
                map: map,
                taxList: data
            })
        })

    }

    getGeojson() {

        if (geojsonTest.type === 'Topology') {
            for (var key in geojsonTest.objects) {
                var gjn = topojson.feature(geojsonTest, geojsonTest.objects[key]);
            }
            //console.log(gjn)
            return gjn
        } else {
            return geojsonTest
        }
    }

    onClickFill(evt) {

        //source: geojson-1
        console.log(evt.features[0])
        var regionId = evt.features[0].properties.region_id;
        console.log(regionId);

        //console.log(this.state.taxList[5]);
        var matching = [];

        _.find(this.state.taxList, function (o) {
            if (o.region_id == regionId) {
                matching.push([o.tpl_input, o.status]);

            }
        })

        console.log(matching);

        this.setState({
            matching: matching
        })


        //console.log(evt.features[0].properties.GeodAREA);
        //console.log(evt.features[0])
        /*  for (var x in this.state.regionData) {
              if (this.state.regionData[x].OBJIDsic == clickObjId) {
                  //console.log(this.state.regionData[x])
                  break;
              }
          } */

        /* var bounds = bbox(evt.features[0].geometry)
 
         this.state.map.fitBounds(bounds, {
             linear: true,
             padding: 20,
             speed: 0.8
         }); */

    }


    onEnter(e) {

        e.target.getCanvas().style.cursor = 'pointer'

        //console.log(this.state.map.getZoom());
        this.setState({
            county: 'Taxa Count: ' + e.features[0].properties.taxCount,
            tdwg4_name: e.features[0].properties.tdwg4_name //'TDWG4 Name: ' + e.features[0].properties.tdwg4_name
        })
    }

    onExit(e) {

        e.target.getCanvas().style.cursor = 'grab'

        this.setState({
            tdwg4_name: 'Hover for',
            county: 'Information'
        })

    }

    handleButton(e) {
        console.log(this.state.map.getStyle().layers)
        const geojLayer = this.state.map.getStyle().layers[74];

        console.log(this.state.map.getLayoutProperty('glonafAreas', 'visibility'))
        //console.log(this.state.map.getStyle().layers)

        if (this.state.map.getLayoutProperty('glonafAreas', 'visibility') === 'visible') {

            this.state.map.setLayoutProperty('glonafAreas', 'visibility', 'none');
            this.state.map.setLayoutProperty('glonafAreasSmall', 'visibility', 'none');
            this.state.map.setLayoutProperty('geojson-1-circle', 'visibility', 'none');



        } else {
            this.state.map.setLayoutProperty('glonafAreas', 'visibility', 'visible');
            this.state.map.setLayoutProperty('glonafAreasSmall', 'visibility', 'visible');
            this.state.map.setLayoutProperty('geojson-1-circle', 'visibility', 'visible');
        }
    }

    addDensPop(e) {
        console.log(this.state.map.getLayoutProperty('popdense_layer', 'visibility'))
        if (this.state.map.getLayoutProperty('popdense_layer', 'visibility') === 'none') {

            this.state.map.setLayoutProperty('popdense_layer', 'visibility', 'visible');

        } else {
            this.state.map.setLayoutProperty('popdense_layer', 'visibility', 'none');
        }
    }

    addCompleteness(e) {

        const colorScheme = [
            'match',
                    ['get', 'completeness'],
                    1, '#fc8d59',
                    2, '#ffffbf',
                    3, '#99d594',
                    'purple'
        ]

        if (!this.state.inventoryView) {
            this.setState({
                inventoryView: true,
                inventoryButton: 'Taxon Count View'
            })
            this.state.map.setPaintProperty('glonafAreas', 'fill-color', colorScheme)
            this.state.map.setPaintProperty('glonafAreasSmall', 'fill-color', colorScheme)
            this.state.map.setPaintProperty('geojson-1-circle', 'circle-color', colorScheme)
        } else {

            this.setState({
                inventoryView: false,
                inventoryButton: 'Inventory Completeness'

            })
            this.state.map.setPaintProperty('glonafAreas', 'fill-color', fillColorScheme())
            this.state.map.setPaintProperty('glonafAreasSmall', 'fill-color', fillColorScheme())
            this.state.map.setPaintProperty('geojson-1-circle', 'circle-color', fillColorScheme())
        }

    }

    handleDrop(e) {
        //console.log(e)

        if (e.value === null) {
            this.state.map.setFilter('glonafAreas', this.state.bigFilter);
            this.state.map.setFilter('glonafAreasSmall', this.state.smallFilter);
            this.state.map.setFilter('geojson-1-circle', e.value);

            this.state.map.flyTo({
                center: this.state.map.center
            })
        }
        else {
            //console.log(this.state.map.getStyle().layers);
            this.state.map.setFilter('glonafAreas', ['==', 'tdwg1_name', e.value]);
            this.state.map.setFilter('glonafAreasSmall', ['==', 'tdwg1_name', e.value]);
            this.state.map.setFilter('geojson-1-circle', ['==', 'tdwg1_name', e.value]);

            this.state.map.flyTo({
                center: centers[e.value]
            });
        }
    }


    handlePlantDrop(e) {
        let selectedPlant = e.value
        var matching = []
        var alienOrNot = {}
        _.find(this.state.taxList, function (o) {
            if (o.standardized_name == selectedPlant) {

                matching.push(Number(o.region_id))
                if (o.status == 'alien') {
                    alienOrNot[o.region_id.toString()] = 'red'
                } else {
                    alienOrNot[o.region_id.toString()] = 'blue'
                }
            }
        })

        console.log(alienOrNot);
        //console.log(this.state.map.getStyle().layers[13])

        var filter1 = ["match",
            ['get', "region_id"],
            _.uniq(matching),
            true,
            false
        ];

        this.state.map.setFilter('glonafAreas', filter1);
        this.state.map.setFilter('glonafAreasSmall', filter1);
        this.state.map.setFilter('geojson-1-circle', filter1);


        console.log(alienOrNot['791'])


        this.state.map.setPaintProperty(
            'glonafAreas',
            'fill-outline-color',
            'red'
            /* ['get',
                ['string', ['get', 'region_id']],
                ['literal', alienOrNot]
            ] */

        )

        /*      this.state.map.setPaintProperty(
                  'glonafAreasSmall',
                  'fill-outline-color',
              )
              this.state.map.setPaintProperty(
                  'geojson-1-circle',
                  'circle-stroke-color',
                  getColor()
              ) */

    }

    render() {

        const geojson_source_options = {
            "type": "geojson",
            "data": this.state.geojsonData
        }

        //console.log([...new Set(this.state.taxList.map(i => i.tpl_input))]);

        return (
            <div>

                <Sidebar
                    county={this.state.county}
                    tdwg4_name={this.state.tdwg4_name}
                    buttonClick={this.handleButton}
                    addPopDen={this.addDensPop}
                    addCompleteness={this.addCompleteness}
                    completenessWords={this.state.inventoryButton}
                    //matching={this.state.matching}
                    dropChange={this.handleDrop}
                    taxon={[...new Set(this.state.taxList.map(i => i.standardized_name))]}
                    plantDropChange={this.handlePlantDrop}
                >

                </Sidebar>

                <Map
                    className='Map'
                    style={this.state.mapStyle}
                    zoom={this.state.zoom}
                    center={this.state.center}
                    maxZoom={16}
                    minZoom={3}
                    /* maxBounds={[
                        [-190, -90],
                        [190, 90]
                    ]} */
                    dragRotate={false}
                    pitchWithRotate={false}
                    onStyleLoad={el => this.loadStyle(el)}
                    containerStyle={{
                        height: "100vh",
                        width: '100vw'
                    }}
                >


                    <Source id='geojsonSource' geoJsonSource={geojson_source_options} />
                    <Layer
                        id='glonafAreas'
                        type='fill'
                        sourceId='geojsonSource'
                        //before='waterway-label'
                        paint={bigFill()}
                        layout={{
                            'visibility': 'visible'
                        }}
                        filter={this.state.bigFilter}
                        onMouseMove={this.onEnter}
                        onMouseLeave={this.onExit}
                        onClick={this.onClickFill}
                    />

                    <Layer
                        id='glonafAreasSmall'
                        type='fill'
                        sourceId='geojsonSource'
                        //before='waterway-label'
                        minZoom={4}
                        paint={smallFill()}
                        layout={{
                            'visibility': 'visible'
                        }}
                        filter={this.state.smallFilter}
                        onMouseMove={this.onEnter}
                        onMouseLeave={this.onExit}
                        onClick={this.onClickFill}

                    />

                    <GeoJSONLayer
                        data={this.state.islands}
                        circlePaint={circleFill()}
                        layerOptions={{
                            'maxzoom': 4
                        }}
                        circleLayout={{
                            'visibility': 'visible'
                        }}
                        circleOnClick={this.onClickFill}
                        circleOnMouseMove={this.onEnter}
                        circleOnMouseLeave={this.onExit}
                    />

                    <Source id='popDense' tileJsonSource={{
                        "type": "raster",
                        'tiles': [
                            'http://tile.casa.ucl.ac.uk/duncan/WorldPopDen2015b/{z}/{x}/{y}.png'
                        ],
                        "tileSize": 256

                    }} />
                    <Layer
                        type='raster'
                        id='popdense_layer'
                        sourceId="popDense"
                        before="glonafAreas"
                        layout={{
                            'visibility': 'none'
                        }} />


                    {/*  <GeoJSONLayer
                            data={this.state.geojsonData}
                            layerOptions={{
                                //'filter': ['==', 'island', 1]
                                //'filter': ['>=', 'GeodAREA', 1639]
                            }}
                            fillLayout={{
                                'visibility': 'visible'
                                
                            }}
                            
                            fillPaint={this.fillStyle()}
                            before='waterway-label'
                            fillOnClick={this.onClickFill}
                            fillOnMouseMove={this.onEnter}
                            fillOnMouseLeave={this.onExit}
                        /> */}
                    <Legend checkLayer={this.state.inventoryView}></Legend>
                </Map>
            </div>

        )
    }

}