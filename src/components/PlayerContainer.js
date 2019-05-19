import React from 'react'
import PlayerWrapper from './PlayerWrapper';
import Player from './Player';
import { MdKeyboardArrowUp } from 'react-icons/md';

class PlayerContainer extends React.PureComponent {
  state = {
    open: false
  }

  render = () => {
    return (
      <PlayerWrapper show={this.state.open}>
        <div className="handle"><button title="Audio Player" onClick={() => this.setState({open: !this.state.open})}><small>AUDIO</small> <MdKeyboardArrowUp/></button></div>
        <Player ref={this.props.playerRef} {...this.props}/>
      </PlayerWrapper>
    )
  }
}

export default PlayerContainer
