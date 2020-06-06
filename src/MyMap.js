import React, { Component } from 'react'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import * as topojson from 'topojson-client';
import geojsonTest from './data/geojsons/glonaf_tax.json'


const { token, styles } = require('./data/config.json')

const Map = ReactMapboxGl({
    accessToken: token
})

export default class MyMap extends Component {

    constructor(props) {

        super(props)

        this.state = {
            county: 'Tax Count',
            center: {
                lng: -71.77,
                lat: 43.71
            },
            mapStyle: styles.light,
            geojsonData: this.getGeojson(),
            zoom: [6]
        }

        this.onClickFill = this.onClickFill.bind(this);
        this.onEnter = this.onEnter.bind(this)
        this.onExit = this.onExit.bind(this)
        this.handleButton = this.handleButton.bind(this)

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
             'fill-outline-color': 'red'
         } 

       /* return {
            'fill-color': 'blue',
            'fill-opacity': 0.8,
            'fill-outline-color': 'red'

        } */
    }


    onClickFill(evt) {


        console.log(evt.features[0].geometry)

        
    }


    onEnter(e) {

        e.target.getCanvas().style.cursor = 'pointer'

        this.setState({
            county: 'Tax Count: ' + e.features[0].properties.taxCount
        })
    }

    onExit(e) {

        e.target.getCanvas().style.cursor = 'grab'

        this.setState({
            county: 'Tax Count'
        })

    }

    handleButton() {

        console.log(this.state.mapStyle)
        if( this.state.mapStyle === styles.light) {
            this.setState({
                mapStyle: styles.dark
            })
        } else {
            this.setState({
                mapStyle: styles.light
            })
        }


    }

    render() {


        return (
            <div>
                <div className="Sidebar">
                    <button onClick={this.handleButton}>Change Style</button>
                    <h1>{this.state.county}</h1>
                </div>
                <div className='Map'>
                    <Map
                        style={this.state.mapStyle}
                        zoom={this.state.zoom}
                        center={this.state.center}
                        containerStyle={{
                            height: "100%",
                            width: '100%'
                        }}
                    >

                        <GeoJSONLayer
                            data={this.state.geojsonData}
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