function forEach (array, callback) {
    for(var i = 0; i <= array.length; i++) {
        callback(array[i]);
    }
}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}