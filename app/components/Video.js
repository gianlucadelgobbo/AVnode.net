import { h } from 'preact';

const Video = ({ id, type }) => {
  switch (type) {
  case 'vimeo':
    return (
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          width="640"
          height="360"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        >
        </iframe>
    );
  case 'youtube':
    return (
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          width="640"
          height="360"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        >
        </iframe>
    );
  }
};

export default Video;
