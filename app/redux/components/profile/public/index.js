import {h, render, Component} from 'preact';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';

class ProfilePublic extends Component {

    onSubmit(values){
        console.log("values", values)
    }

    render() {

        return (
            <div class="row">
                <div className="class-md-3">
                    <Navbar/>
                </div>
                <div className="class-md-9">
                    <Form
                        onSubmit={this.onSubmit.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

ProfilePublic = connect(
    mapStateToProps
)(ProfilePublic);

export default ProfilePublic;
