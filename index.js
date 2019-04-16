var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require("request");
var DOMParser = require('xmldom').DOMParser;

//listen to port 3000
http.listen(3000);

/**
 * On Connecction user switches into channelID room
 * If room isnt already created -> call sendToRoom to start pushing channel data into room
 */
io.on('connection', function(socket){
    console.log('User connected');

    socket.on('room', function(room) {
        console.log('User switched to ' + room);
        socket.leave(socket.room);

        if(!(io.sockets.adapter.rooms.hasOwnProperty(room))) {
            sendToRoom(room);
        }

        socket.join(room);
        socket.room = room;
    });
  
    socket.on('disconnect', function(){
      console.log('User disconnected');
    });
});

/**
 * Push Channel Statistics into Channel Room with a specified interval
 * @param room -> roomID (Channel ID) user switched to 
 */
function sendToRoom(room) {
    setInterval(function () {
        getChannelStats(room, function(channelStats) {
            io.to(room).emit(room, channelStats);
        });
    }, 800);
}

/**
 * Get Channel Statistics
 * Downloads raw html content of channel page and extracts views and subcounts
 * cleans raw content and puts it back in an object
 * @param channelID -> roomID which is Channel ID or Youtube Channel
 * @return callback -> object with channel statistics
 */
function getChannelStats(channelID, callback) {
    var channelStatistics = {subcount: '', viewcount: '', cid: channelID};

    request({uri: "http://youtube.com/channel/" + channelID}, function(error, response, body) {
        if(body) {
            var subArr = body.match(/<span class=\"yt-subscription-button-subscriber-count-branded-horizontal(.*?)\">(.*?)<\/span>/s) || [null];

            if(!(subArr[2] === undefined)) {
                channelStatistics.subcount = cleaner(subArr[2]);
            }

            request({uri: "http://youtube.com/channel/" + channelID + "/about"}, function(error, response, body) {
                if(body) {
                    var viewArr = body.match(/<b>(.*?)<\/b> views/) || [null];
              
                    if(!(viewArr[0] === undefined)) {
                        var views = viewArr[0].replace(' views','');
                        channelStatistics.viewcount = cleaner(extractContent(views));
                    }

                    if(!((subArr[2] === undefined) || (viewArr[0] === undefined))) {
                        callback(channelStatistics);
                    }
                }
            });
        }
    });
};

/**
 * Extract Value of p/span Element
 * @param html -> HTML p/span Elemnt
 */
function extractContent(html) {
    return (new DOMParser()).parseFromString(html, 'text/xml') . documentElement . firstChild . data;
}

/**
 * String to Raw Number
 * @param val -> value like 999,999,999 as string
 */
function cleaner(val) {
    return val.replace(/\D/g,'');
}