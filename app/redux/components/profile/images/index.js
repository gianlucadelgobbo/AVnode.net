import {h, render, Component} from 'preact';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';

class ProfileImages extends Component {

    render() {

        return (
            <div class="row">
                <div className="class-md-3">
                    <Navbar/>
                </div>
                <div className="class-md-9">
                    <Form/>
                </div>

            </div>
        );
    }

}

const mapStateToProps = (state) => ({});

ProfileImages = connect(
    mapStateToProps
)(ProfileImages);

export default ProfileImages;
