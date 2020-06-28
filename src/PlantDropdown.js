import React, { Component } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'


class PlantDropdown extends Component {

        constructor(props) {
            super(props)



        }

    render() {
        return(
            <Dropdown
                options={this.props.taxon}
                value={'Select Plant'}
                onChange={this.props.plantDropChange}
                
            ></Dropdown>
        )
    }

}

export default PlantDropdown