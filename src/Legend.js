import React, { Component } from 'react'
import styled from 'styled-components'
import './legend.css'




class Legend extends Component {

    render() {
        if (this.props.checkLayer) {
            return(
                <div className='legend'>
                <h3>Inventory Completeness</h3>
                <span style={{background: '#eeb479'}}></span>
                <label>Likely very incomplete</label>
                <span style={{background: '#e9e29c'}}></span>
                <label>Likely incomplete</label>
                <span style={{background: '#9ccb86'}}></span>
                <label>Likely nearly complete</label>
                
            </div>
            )
        } else {

        
        return(
            <div className='legend'>
                <h3># of Taxa</h3>
                <span style={{background: "#edf8fb"}}></span>
                <label>146</label>
                <span style={{background: "#b2e2e2"}}></span>
                <label>409</label>
                <span style={{background: "#66c2a4"}}></span>
                <label>774</label>
                <span style={{background: "#2ca25f"}}></span>
                <label>1233</label>
                <span style={{background: "#006d2c"}}></span>
                <label>3301</label>
            </div>
        )
    }
    }

}


export default Legend