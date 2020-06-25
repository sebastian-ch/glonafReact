import React, { Component } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
import styled from 'styled-components'




const tdwg1Names = [
    {value: 'Africa', label: 'Africa'},
    {value: 'Antarctic', label: 'Antarctic'}, 
    {value: 'Asia-Temperate', label: 'Asia-Temperate'},
    {value: 'Asia-Tropical', label: 'Asia-Tropical'},
    {value: 'Australasia', label: 'Australasia'},
    {value: 'Europe', label: 'Europe'},
    {value: 'mixed', label: 'mixed'},
    {value: 'Northern America', label: 'Northern America'},
    {value: 'Southern America', label: 'Southern America'},
    {value: 'Pacific', label: 'Pacific'}
]

const FullSidebar = styled.div`
    width: 20%;
    value-align: center;
    height: 350px;
    margin-top: 10px;
    margin-left: 10px;
    position: absolute;
    background-color: whitesmoke;
    border: 1px solid black;
    z-index: 800;

`



class Sidebar extends Component {

    constructor(props) {
        super(props)

    }

  

    render() {

        return (
            <FullSidebar>
                <button onClick={this.props.buttonClick}>Remove Layer</button>
                <h1>{this.props.county}</h1>
                <h4>{this.props.tdwg4_name}</h4>
               {/* <p>{this.props.matching}</p> */}

                <Dropdown
                    options={tdwg1Names}
                    value={tdwg1Names[0]}
                    onChange={this.props.dropChange}
                    ></Dropdown>
            
            </FullSidebar>


        )
    }


}

export default Sidebar