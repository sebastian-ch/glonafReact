import React, { Component } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
import PlantDropdown from './PlantDropdown'
import styled from 'styled-components'

const tdwg1Names = [
    { value: null, label: 'All' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Antarctic', label: 'Antarctic' },
    { value: 'Asia-Temperate', label: 'Asia-Temperate' },
    { value: 'Asia-Tropical', label: 'Asia-Tropical' },
    { value: 'Australasia', label: 'Australasia' },
    { value: 'Europe', label: 'Europe' },
    { value: 'mixed', label: 'mixed' },
    { value: 'Northern America', label: 'Northern America' },
    { value: 'Southern America', label: 'Southern America' },
    { value: 'Pacific', label: 'Pacific' }
]

const ToggleButtons = styled.button`
    border: 1px solid black;
    background-color: 'red';
    padding: 10px 10px;
    text-align: center;

    &:hover {
        opacity: 0.5;
        cursor: pointer;
    }
`

const References = styled.div`
    border: 1px solid black;
    text-align: center;
    padding-bottom: 80px;
    padding-top: 10px;
    width: 80%;
    margin: 10px auto;

`

const FullSidebar = styled.div`
    text-align: center;
    width: 20%;
    value-align: center;
    height: 100%;
    /*margin-top: 10px;
    margin-left: 10px; */
    position: absolute;
    background-color: whitesmoke;
    border-right: 1px solid black;
    z-index: 800;

`



class Sidebar extends Component {

    constructor(props) {
        super(props)

    }

    render() {

        return (
            <FullSidebar>
                <h1>GloNAF Interactive Atlas</h1>
                <br></br>
                <br></br>
                <br></br>
                <h1 style={{marginBottom: '0'}}>{this.props.tdwg4_name}</h1>
                <h1 style={{marginTop: '0'}}>{this.props.county}</h1>
                
                {/* <p>{this.props.matching}</p> */}


                <br></br>
                <br></br>
                <br></br>
                
                <ToggleButtons onClick={this.props.buttonClick}>Remove GloNAF Layer</ToggleButtons>
                <br></br>
                <ToggleButtons onClick={this.props.addPopDen}>Add Population Density Layer</ToggleButtons>
                <br></br>
                <ToggleButtons onClick={this.props.addCompleteness}>{this.props.completenessWords}</ToggleButtons>
                <br></br>
                <br></br>
                <Dropdown
                    style={{width:'80%'}}
                    options={tdwg1Names}
                    value={"Select Continent"}
                    onChange={this.props.dropChange}
                ></Dropdown>
                <PlantDropdown
                    className='dropdown'
                    taxon={this.props.taxon}
                    plantDropChange={this.props.plantDropChange}
                ></PlantDropdown>

                <References>References and External Links will go here</References>
            </FullSidebar>


        )
    }


}

export default Sidebar