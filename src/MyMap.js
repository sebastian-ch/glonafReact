import React, { useState, Component } from 'react'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import * as topojson from 'topojson-client';
import Sidebar from './Sidebar'
import bbox from '@turf/bbox'
import geojsonTest from './data/geojsons/glonaf_tax_join_topo.json'
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
            mapStyle: styles.light,
            geojsonData: this.getGeojson(),
            zoom: [6],
            map: null,
            regionData: null,


        }

        this.onClickFill = this.onClickFill.bind(this);
        this.onEnter = this.onEnter.bind(this)
        this.onExit = this.onExit.bind(this)
        this.handleButton = this.handleButton.bind(this)
    }

    loadStyle(map) {
        this.setState({
            map: map
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

    fillStyle() {

         return {
             'fill-color': {
 
                 property: 'taxCount',
                 stops: [
                     [146, "#edf8fb"],
                     [409, "#b2e2e2"],
                     [774, "#66c2a4"],
                     [1233, "#2ca25f"]
                 ]
             },
             'fill-opacity': 0.8,
             'fill-outline-color': 'black'
         }

       /* return {
            'fill-color': 'black',
            'fill-opacity': 0.8,
            'fill-outline-color': 'red'

        } */
    }



    onClickFill(evt) {

        //source: geojson-1

        var clickObjId = evt.features[0].properties.taxCount;
        //console.log(clickObjId);
        console.log(evt.features[0])
        for (var x in this.state.regionData) {
            if (this.state.regionData[x].OBJIDsic == clickObjId) {
                //console.log(this.state.regionData[x])
                break;
            }
        }

        var bounds = bbox(evt.features[0].geometry)

        this.state.map.fitBounds(bounds, {
            linear: true,
            padding: 20,
            speed: 0.8
        });


    }


    onEnter(e) {

        e.target.getCanvas().style.cursor = 'pointer'

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

        console.log(this.state.map.getLayoutProperty('geojson-1-fill', 'visibility'))

        if (this.state.map.getLayoutProperty('geojson-1-fill', 'visibility') === 'visible') {

            this.state.map.setLayoutProperty('geojson-1-fill', 'visibility', 'none');

        } else {
            this.state.map.setLayoutProperty('geojson-1-fill', 'visibility', 'visible');
        }


    }

    render() {

        //Region();

        return (
            <div>

                <Sidebar
                    county={this.state.county}
                    tdwg4_name={this.state.tdwg4_name}
                    buttonClick={this.handleButton}>
                       
                </Sidebar>

                <div className='Map'>

                    <Map
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


                        <GeoJSONLayer
                            data={this.state.geojsonData}
                            fillLayout={{
                                'visibility': 'visible'
                                
                            }}
                            fillPaint={this.fillStyle()}
                            before='waterway-label'
                            fillOnClick={this.onClickFill}
                            fillOnMouseMove={this.onEnter}
                            fillOnMouseLeave={this.onExit}
                        />


                    </Map>
                </div>
            </div>
        )
    }




}