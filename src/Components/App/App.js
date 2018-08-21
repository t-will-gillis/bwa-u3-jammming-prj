import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import PlayList from '../PlayList/PlayList.js';
import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: 'New PlayList',
      playListTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
  }

  addTrack(track) {
   if (this.state.playListTracks.find(savedTrack =>
     savedTrack.id === track.id)) {
      return;
      } else {
        const newPlayListTracks = this.state.playListTracks;
        newPlayListTracks.push(track);
        this.setState({playListTracks: newPlayListTracks});
      }
  }

  removeTrack(track) {
    const newPlayListTracks = this.state.playListTracks.filter(savedTrack =>
      savedTrack.id !== track.id);
        this.setState({playListTracks: newPlayListTracks});
  }

  updatePlayListName(name) {
    this.setState({playListName: name});
  }

  savePlayList() {
    let trackURIs = this.state.playListTracks.map(playListTrack => playListTrack.uri);
    Spotify.savePlayList(this.state.playListName, trackURIs);
    this.setState({playListName: 'New PlayList', playListTracks: [] });
  }

  searchSpotify(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.searchSpotify} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                      onAdd={this.addTrack} />
            <PlayList playListName={this.state.playListName}
                      playListTracks={this.state.playListTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlayListName}
                      onSave={this.savePlayList} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
