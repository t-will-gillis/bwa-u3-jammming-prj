const client_id = 'bcb47da6712d4a12965d3d4df787345f';
const redirect_uri = 'http://TestDeployJammmingSurgeTWG.surge.sh/';

let accessToken = '';
let expiresIn = '';

const currentURL = window.location.href;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (currentURL.match(/access_token=([^&]*)/) && currentURL.match(/expires_in=([^&]*)/)) {
        accessToken = currentURL.match(/access_token=([^&]*)/)[1];
        expiresIn = Number(currentURL.match(/expires_in=([^&]*)/)[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        } else {
            window.location = (`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`);
               }
  },

  search(searchTerm) {
    const accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
          if (jsonResponse.tracks) {
            return jsonResponse.tracks.items.map(track => ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }));
          } else {
            return jsonResponse.tracks = [];
          }
        });
  },

  savePlayList(playListName,trackURIs) {
    const accessToken = this.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userID = '';
    let playListID = '';
    if (!playListName && !trackURIs) {
      return;
    } else {
    return fetch(`https://api.spotify.com/v1/me`,{
        headers: headers
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playListName})
        })
      }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          playListID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playListID}/tracks`,{
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackURIs})
              })
            }).then(response => {
              return response.json();
            })
        }
    }
};

export default Spotify;
