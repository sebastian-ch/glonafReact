import React from 'react'
import Button from '@material-ui/core/Button';

class NewButton extends React.Component {

    constructor(props) {

        super(props)



    }


    handleClick(map) {
        
        map.getLayoutProperty()
    }


    render() {

        return (
            <Button
                variant='contained'
                color="primary"
                onClick={this.handleClick(this.props.map)}
            > {this.props.msg}
            </Button>
        )

    }

}


export default NewButton