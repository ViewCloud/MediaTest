var video = document.querySelector('video');

// var assetURL = 'http://vjs.zencdn.net/v/oceans.mp4';
var assetURL = 'http://pear.ac.cn:8080/vr.mp4';
// var assetURL = 'https://pear.hk/demo.mp4';
// var assetURL = '../src/big-buck-bunny_trailer.webm';
// Need to be specific for Blink regarding codecs
// ./mp4info frag_bunny.mp4 | grep Codec
var mimeCodec = 'video/webm; codecs="vorbis,vp8"';

if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
  var mediaSource = new MediaSource;
  //console.log(mediaSource.readyState); // closed
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen);
} else {
  console.error('Unsupported MIME type or codec: ', mimeCodec);
}

function sourceOpen (_) {
  //console.log(this.readyState); // open
  var mediaSource = this;
  var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  fetchAB(assetURL, function (buf) {
    sourceBuffer.addEventListener('updateend', function (_) {
      mediaSource.endOfStream();
      video.play();
      //console.log(mediaSource.readyState); // ended
    });
    console.log( buf);
    // test
    // transform to Blob type
    var file = new Blob([buf], {type: 'video/webm'});
    // now buf is blob type
    // var file = buf;
    console.log(file);
    // use FileReader to read file as ArrayBuffer
    var reader = new FileReader();
    reader.readAsArrayBuffer(file.slice(0, file.size))
    reader.onload = function(e) {
      sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
    }

    // sourceBuffer.appendBuffer(buf);
  });
};

function fetchAB (url, cb) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  // xhr.responseType = 'blob';
  xhr.setRequestHeader('Range', 'bytes=0-20000');
  xhr.onload = function () {
    cb(xhr.response);
  };
  xhr.send();
};
