import React from 'react';
import { connect } from 'react-redux';
import flv from 'flv.js';
import { fetchStream } from '../../actions';

// const NodeMediaServer = require('node-media-server');

class StreamShow extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchStream(this.props.match.params.id);
    this.buildPlayer();
  }

  componentDidUpdate() {
    this.buildPlayer();
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  buildPlayer() {
    if (this.player || !this.props.stream) {
      return;
    }
    this.player = flv.createPlayer({
      type: 'flv',
      url: `http://0.0.0.0:8000/live/${this.props.match.params.id}.flv`
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
  }

  render() {
    if (!this.props.stream) {
      return <div>Loading...</div>;
    }

    const { title, description } = this.props.stream;

    return (
      <div>
        <h1>{title}</h1>
        <h5>{description}</h5>
        <video ref={this.videoRef} style={{ width: '100%' }} controls={true} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    stream: state.streams[ownProps.match.params.id]
  };
};

export default connect(mapStateToProps, { fetchStream })(StreamShow);
