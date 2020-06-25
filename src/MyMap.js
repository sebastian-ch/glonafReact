import React, { Component } from 'react'
import ReactMapboxGl, { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl';
import * as topojson from 'topojson-client';
import Sidebar from './Sidebar'
import bbox from '@turf/bbox'
import geojsonTest from './data/geojsons/region2wTax-topo.json'
import islands from './data/geojsons/islands.geojson'
import _ from 'lodash'
import * as d3 from 'd3'
import taxList from './data/glonaf/tax-list1.txt'
import { bigFill, smallFill, circleFill } from './mapUtils'

const { token, styles } = require('./data/config.json')

const Map = ReactMapboxGl({
    accessToken: token
})


export default class MyMap extends Component {
    constructor(props) {

        super(props)

        this.state = {
            county: 'Tax Count',
            tdwg4_name: 'TDWG4 Name',
            center: {
                lng: -71.627, //7.91
                lat: 43.77 //50.85
            },
            mapStyle: styles.myStyle,
            geojsonData: this.getGeojson(),
            islands: islands,
            zoom: [2],
            map: null,
            regionData: null,
            bigFilter: ['any',
                ['>=', 'GeodAREA', 1639],
                ['==', 'island', 0]
            ],
            taxList: null,
            matching: [],



        }

        this.onClickFill = this.onClickFill.bind(this);
        this.onEnter = this.onEnter.bind(this)
        this.onExit = this.onExit.bind(this)
        this.handleButton = this.handleButton.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
    }


    loadStyle(map) {

        this.setState({
            map: map
        })

        const self = this;
        /* d3.dsv('\t', taxList).then((data) => {
             self.setState({
                 map: map,
                 taxList: data
             })
         }) */

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
            county: 'Tax Count: ' + e.features[0].properties.taxCount,
            tdwg4_name: 'TDWG4 Name: ' + e.features[0].properties.tdwg4_name
        })
    }

    onExit(e) {

        e.target.getCanvas().style.cursor = 'grab'

        this.setState({
            county: 'Tax Count',
            tdwg4_name: 'TDWG4 Name'
        })

    }

    handleButton(e) {
        const geojLayer = this.state.map.getStyle().layers[74];

        console.log(this.state.map.getLayoutProperty('glonafAreas', 'visibility'))
        //console.log(this.state.map.getStyle().layers)
        if (this.state.map.getLayoutProperty('glonafAreas', 'visibility') === 'visible') {

            this.state.map.setLayoutProperty('glonafAreas', 'visibility', 'none');

        } else {
            this.state.map.setLayoutProperty('glonafAreas', 'visibility', 'visible');
        }
    }

    handleDrop(e) {
        console.log(e)

        //console.log(this.state.map.getStyle().layers);
        this.state.map.setFilter('glonafAreas', ['==', 'tdwg1_name', e.value]);
        this.state.map.setFilter('glonafAreasSmall', ['==', 'tdwg1_name', e.value]);
        this.state.map.setFilter('geojson-1-circle', ['==', 'tdwg1_name', e.value]);

        
    }

    render() {

        const geojson_source_options = {
            "type": "geojson",
            "data": this.state.geojsonData
        }



        return (
            <div>

                <Sidebar
                    county={this.state.county}
                    tdwg4_name={this.state.tdwg4_name}
                    buttonClick={this.handleButton}
                    //matching={this.state.matching}
                    dropChange={this.handleDrop}

                >

                </Sidebar>

                <Map
                    className='Map'
                    style={this.state.mapStyle}
                    zoom={this.state.zoom}
                    center={this.state.center}
                    maxZoom={19}
                    minZoom={3}
                    maxBounds={[
                        [-190, -90],
                        [190, 90]
                    ]}
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
                        before='waterway-label'
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
                        before='waterway-label'
                        minZoom={4}
                        paint={smallFill()}
                        filter={
                            ['all',
                                ['<', 'GeodAREA', 1639],
                                ['==', 'island', 1]
                            ]
                        }
                        onMouseMove={this.onEnter}
                        onMouseLeave={this.onExit}

                    />

                    <GeoJSONLayer
                        data={this.state.islands}
                        circlePaint={circleFill()}
                        layerOptions={{
                            'maxzoom': 4
                        }}
                        circleOnClick={this.onClickFill}
                        circleOnMouseMove={this.onEnter}
                        circleOnMouseLeave={this.onExit}
                    />


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
                </Map>
            </div>

        )
    }

}