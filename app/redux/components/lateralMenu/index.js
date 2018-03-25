import {h, Component} from 'preact';
import {Link} from 'preact-router/match';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";

class LateralMenu extends Component {

    createMenuItem = ({model, index}) => {

        return (
            <Link href={model.href} activeClassName="active" className="nav-link" key={index}>
                {model.label}
            </Link>);
    };

    render() {

        const {items = []} = this.props;

        return (
            <nav id="account-sidenav" className="nav-justified pull-left">
                {items.map((model, index) => this.createMenuItem({model, index}))}
            </nav>)
    }

}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

LateralMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(LateralMenu);

export default LateralMenu;