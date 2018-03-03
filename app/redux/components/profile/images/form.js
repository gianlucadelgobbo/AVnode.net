import {h, render, Component} from 'preact';
import {connect} from 'preact-redux';

class ProfilePublic extends Component {

    render() {

        return (
            <div >
              FORM IMAGES

            </div>
        );
    }

}

const mapStateToProps = (state) => ({});

ProfilePublic = connect(
    mapStateToProps
)(ProfilePublic);

export default ProfilePublic;
