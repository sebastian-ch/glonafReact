import React, { Component } from 'react'
import styled from 'styled-components'


const FullSidebar = styled.div`
    width: 20%;
    text-align: center;
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
                <button onClick={this.props.buttonClick}>Change Style</button>
                <h1>{this.props.county}</h1>
                <h4>{this.props.tdwg4_name}</h4>

            </FullSidebar>


        )
    }


}

export default Sidebar