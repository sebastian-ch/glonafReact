import React from 'react'
import Papa from 'papaparse'

import regionData from './data/glonaf/region1.csv'


function Region() {

    
    Papa.parse(regionData, {
        header: true,
        download: true,
        complete: (res) => {
            dealWithData(res)
        }
    })

    function dealWithData(res) {
        
        //console.log(res);
        return res;
    }


     

}

export default Region;

