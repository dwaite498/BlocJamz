var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtURL: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtURL: 'assets/images/album_covers/20.png',
    songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21' },
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15' }
     ]
};

var albumWellington = {
    title: 'The General',
    artist: 'Arthur Wellesley',
    label: 'Great Britain',
    year: '1815',
    albumArtURL: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Dublin Born', duration: '2:32' },
        { title: 'Irish Soldier', duration: '3:01' },
        { title: 'Peninsular Campaign', duration: '1:45' },
        { title: 'Ambassador to France', duration: '1:00' },
        { title: 'Waterloo Campaign', duration: '5:21' },
        { title: 'Prime Minister Wellesley', duration: '3:22' }
    ]
};

var setSong = function(songNumber) {
    currentlyPlayingSong = parseInt(songNumber);
    }

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
     '<tr class="album-view-song-item">'
     +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     +'  <td class="song-item-title">' + songName + '</td>'
     +'  <td class="song-item-duration">' + songLength + '</td>'
     +'</tr>'
     ;
    
     var $row = $(template);
    
     var clickHandler = function() {
         var songNumber = $(this).click('data-song-number');
         debugger;
         
         if (currentlyPlayingSong !== null) {
             var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
             currentlyPlayingCell.html(currentlyPlayingSong);
         }
         if (currentlyPlayingSong !== songNumber) {
             $(this).html(pauseButtonTemplate);
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
         }
         else if (currentlyPlayingSong === songNumber) {
             $(this).html(playButtonTemplate);
             currentlyPlayingSong = null;
         }
     };
    
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
         
        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
     };
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = songNumberCell.attr('data-song-number');
         
         if(songNumber !== currentlyPlayingSong) {
             songNumberCell.html(songNumber);
         }
         
     };
    
    $row.find('.song-item-number').click(clickHandler);
    
    $row.hover(onHover, offHover);
    
    return $row;
    
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

 var setCurrentAlbum = function(album) {
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;



$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     
     var albums = [albumPicasso, albumMarconi, albumWellington];
     var index = 1;
     albumImage.addEventListener("click", function(event) {
        setCurrentAlbum(albums[index]);
        index++
        if(index == albums.length) {
            index = 0;
        }
        });

 });