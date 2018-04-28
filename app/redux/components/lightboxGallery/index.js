import {h, Component} from 'preact';
import Lightbox from 'react-image-lightbox';

export default class LightboxGallery extends Component {

    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            isOpen: false
        };
    }

    componentDidUpdate() {
        const {photoIndex, isOpen} = this.state;

        if (!isOpen && photoIndex !== 0) {
            this.setState({photoIndex: 0})
        }
    }

    render() {
        const {
            photoIndex,
            isOpen,
        } = this.state;

        const {images, index, alt} = this.props;

        const currentIndex = (photoIndex + index) % images.length;
        const nextIndex = (currentIndex + 1) % images.length;
        const prevIndex = (currentIndex + images.length - 1) % images.length;


        return (
            <div>
                <img src={images[0]} onClick={() => this.setState({isOpen: true})} className="img-responsive" alt={alt}/>

                {isOpen &&
                <Lightbox
                    mainSrc={images[currentIndex]}
                    nextSrc={images[nextIndex]}
                    prevSrc={images[prevIndex]}
                    onCloseRequest={() => this.setState({isOpen: false})}
                    onMovePrevRequest={() => this.setState({
                        photoIndex: photoIndex - 1,
                    })}
                    onMoveNextRequest={() => this.setState({
                        photoIndex: photoIndex + 1,
                    })}
                />
                }
            </div>
        );
    }
}
