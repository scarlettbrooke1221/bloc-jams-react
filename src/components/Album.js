import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './Album.css';

class Album extends Component {
	 constructor(props) {
     super(props);
	 
	  const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
       duration: album.songs[0].duration, 
      currentVolume: 0.9,
      isPlaying: false,
      newIndex: false
     };
	 
	 this.audioElement = document.createElement('audio');
   this.audioElement.src = album.songs[0].audioSrc;
   this.audioElement.volume = 0.9;
   }
componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }

   play() {
     this.audioElement.play();
     this.setState({ isPlaying: true });
   }
   
    pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   } 

   

  setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }
   
 handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }     
       this.play();
     }
   }
   
   handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
   }

   handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const index = Math.max(0, currentIndex + 1);
    const newSong = this.state.album.songs[index];
    const activeIndex = this.state.activeIndex === index ? null : index;
    this.setState({activeIndex});
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume =  e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({currentVolume: newVolume });
  }

  formatTime(e) {
      if (e){
        const minutes = Math.floor(e / 60);
        let seconds = Math.floor(e % 60);
        seconds = ((seconds) < 10) ? ("0" + seconds) : (seconds);
        const newTime = (minutes) + ":" + (seconds);
        return newTime;
      }
      else {
        return "-:--";
      }
    }

    playSongCondition(song) {
      return this.state.isPlaying && song === this.state.currentSong && this.state.currentTime !== this.state.duration;
    }
  
  
  render() {
    return (
      <section className="album">
      <section id="album-info">
      <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/> 
      <div className="album-details">
      <h1 id="album-title">Album: {this.state.album.title}</h1>
      <h2 className="artist">Artist: {this.state.album.artist}</h2>
      <div id="release-info">Release Date, Production Company: {this.state.album.releaseInfo}</div>
      </div>
      </section>
		<table id="song-list">
      <colgroup>
        <col id="song-number-column" />
        <col id="song-title-column" />
        <col id="song-duration-column" />
      </colgroup> 

    <tbody>
		  {
			this.state.album.songs.map((song,index) => 
      <tr className="song" key={index} onClick={() => this.handleSongClick(song)} 
        onMouseEnter={ () => this.setState({ newIndex: index+1 }) }
        onMouseLeave={ () => this.setState({ newIndex: false }) }>

      <td key = {index} className="song-actions">
      <button>
        <span>
       <span className="song-number">{(this.playSongCondition(song)) || (!this.state.isPlaying && song === this.state.currentSong && this.state.currentTime > 0) ? (!this.state.isPlaying ? <i id="font-awesome-play">&#9658;</i> : "") : index + 1}</span>

        <span className={(this.playSongCondition(song)) ? "" : "ion-play"}></span>

         <span className={(this.playSongCondition(song)) ? "ion-pause" : ""}></span>
          </span>
      </button>
  </td>
  <td className="song-title">{song.title}</td>
  <td className="song-duration">{this.formatTime(song.duration)}</td>
        </tr>
      )
    }
      </tbody>
		  </table>
		  <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          currentVolume={this.audioElement.currentVolume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={this.formatTime(this.state.currentTime)}
		   formatDuration={this.formatTime(this.state.duration)}
            />
      </section>
  
    );
  }
}


export default Album;