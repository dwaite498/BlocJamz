var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, { 
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var seek = function(time) {
    debugger;
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
}

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile.isPaused()) {
         $(this).html(playerBarPauseButton);
         currentSoundFile.play();
         
    } else {
        currentSoundFile.stop();
        $(this).html(playerBarPlayButton);
        
    };
}

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
     '<tr class="album-view-song-item">'
     +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     +'  <td class="song-item-title">' + songName + '</td>'
     +'  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
     +'</tr>'
     ;
    
    var $row = $(template);
 
    
   var clickHandler = function() {
	var songNumber = parseInt($(this).attr('data-song-number'));
	if (currentlyPlayingSongNumber === null) {
		var currentlyPlayingCell = getSongNumberCell(songNumber);
        console.log(getSongNumberCell);
 	    setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
	}
	else if (currentlyPlayingSongNumber !== songNumber) {
		$(this).html(pauseButtonTemplate);
		setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        updatePlayerBarSong();
        
        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});

    } 
    else if (currentlyPlayingSongNumber === songNumber) {
		   if (currentSoundFile.isPaused()) {
               $(this).html(pauseButtonTemplate);
               $('main-controls .play-pause').html(playerBarPauseButton);
               currentSoundFile.play();
               updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.stop();
            }
        }
	};
    
    
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
     };
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         if(songNumber !== currentlyPlayingSongNumber) {
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
     currentAlbum = album;
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

var setCurrentTimeInPlayerBar = function(currentTime) {
    var filteredTime = filterTimeCode(currentTime);
    $('.current-time').text(filteredTime);
}

var setTotalTimeInPlayerBar = function(totalTime) {
    var filteredTime = filterTimeCode(totalTime);
    $('.total-time').text(filteredTime);
}

var filterTimeCode = function(timeInSeconds) {
    timeInSeconds = parseFloat(timeInSeconds);
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = Math.floor(timeInSeconds - minutes * 60);

    var completeTime = minutes+':'+str_pad_left(seconds,'0',2);
    return completeTime;
}


var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            setCurrentTimeInPlayerBar(currentSoundFile.getTime());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};


 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
    var $seekBar = $('.player-bar .seek-bar');
    debugger;
    $seekBar.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        debugger;
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBar.find('.thumb').mousedown(function(event) {

        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
        if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
            
        updateSeekPercentage($seekBar, seekBarFillRatio);
    });
        
    $(document).bind('mouseup.thumb', function() {
        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
    })
});
};

var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
}

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';

var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;

var currentAlbum = null;

var currentSongFromAlbum = null;

var currentSoundFile = null;

var currentVolume = 80;

var $previousButton = $('.main-controls .previous');

var $nextButton = $('.main-controls .next');

var $playPausePlayer = $('.main-controls .play-pause');

var nextSong = function() {
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.index) {
        currentSongIndex = 0;
    }
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPausePlayer.click(togglePlayFromPlayerBar);
     
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