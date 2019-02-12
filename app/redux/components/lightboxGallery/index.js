import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

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

        const {images, index = 0, alt, Button} = this.props;

        const currentIndex = (photoIndex + index) % images.length;
        const nextIndex = (currentIndex + 1) % images.length;
        const prevIndex = (currentIndex + images.length - 1) % images.length;

        let Trigger = <img
            src={images[0]}
            className="img-fluid"
            alt={alt}/>;

        if (Button) {
            Trigger = Button;
        }

        return (
            <span className="image-preview">
                <span onClick={() => this.setState({isOpen: true})}>
                    {Trigger}
                </span>

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
            </span>
        );
    }
}
