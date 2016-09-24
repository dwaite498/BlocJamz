GET SONG ITEM ATTEMPT

var getSongItem = function(element) {
    if (element.className == ".song-item-title" || element.ClassName == ".song.item.number" || element.ClassName == "album-view-song-item") {
       switch (element) {
               element.ClassName = ".song-item-number";
               break;
       }
    return element;
    }
} 