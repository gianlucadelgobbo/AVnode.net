import React, { Component } from 'react';
import ProfileLateralMenu from '../lateralMenu';
import Form from './form';

class Preferences extends Component {

    getInitialValues(){
        console.log("initial value")
    }
    onSubmit(values){
        console.log(`${values.preferences}`);
    }

    render() {
        return(
            <div className="row mt-3">
                <div className="col-md-2">
                    <ProfileLateralMenu/>
                </div>
                <div className="col-md-10">
                    <h3 className="labelField">PREFERENCES</h3>
                    <br/>
                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default Preferences;