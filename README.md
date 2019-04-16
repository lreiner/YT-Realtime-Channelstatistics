# Youtube API Websocket for Realtime Updates
<table>
<tr>
<td>
Websocket Server to push out Youtube Channel Data and Statistics in Realtime. Free to use for everyone!  🖨
This Websocket let clients connect to rooms (Youtube Channel IDs) for every youtuber they want. In this rooms they get constant updates about channel statistics and data! Clients can only be connected to one room. 
</tr>
</table>

## :warning: VERY IMPORTANT:warning:
<table>
<tr>
<td>
This application is for private or educational purposes only. You should use the official Youtube Data API: https://developers.google.com/youtube/v3/.
We do not accept responsibility for banned accounts or penalties of any kind caused by the use of this script. We would like to point out that using this script violates the Terms and Conditions. By using the script, you automatically accept that you yourself are criminally responsible for yourself and you are aware that it violates the guidelines.
</td>
</tr>
</table>


## Example Output
Example output for PewDiePie's statistics. In this example the client is connected to the room: UC-lHJZR3Gqxm24_Vd_AJ5Yw (PewDiePie's channel id). Note: This gif output is just an example. It can be different in newer versions of this repo!

![](example.gif)


## Starting the Websocket
Download this project into your folder and run
```
npm install
```
After that run index.js file to start the websocket
```
node index.js
```
Now your Websocket is running and listen to port 3000


## Connect Client and receive Data with pure JS
First import socket.io js file in your project like this
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
```
Now connect to your websocket
```javascript
var socket = io('localhost:3000');
```
Connect to a youtuber room (use the channel id of your selected youtuber). Same goes for switching to another youtuber
```javascript
socket.emit('room', 'UC-lHJZR3Gqxm24_Vd_AJ5Yw');
```
Get the channel data of this room. Just pass the same channel id like before to this function
```javascript
socket.on('UC-lHJZR3Gqxm24_Vd_AJ5Yw', function(channeldata) {
   console.log(channeldata); // object with channel data :-)
});
```

## Connect Client and receive Data with Angular 5.2.11 and RXJS 5.5.11
First install socket.io-client into your project
```javascript
npm install socket.io-client --save
```
Now create a provider/service for your project. Here is an example using the [Ionic Framework](https://ionicframework.com/)
```javascript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';

@Injectable()
export class ChannelStatisticsProvider {

  private url:string = "http://localhost:3000";
  private room:string = "";
  private socket;

  /**
   * Connect to your Websocket
   */
  constructor() {
    this.socket = socketIo(this.url);
  }

  /**
   * Connect to a specified room
   * @param room -> channel id of your selected youtuber
   */
  public setRoom(room:string){
    this.socket.emit("room", room);
    this.room = room;
  }

  /**
   * Get Data from this room 
   * Observable to subscribe to your data and pass it to another function
   */
  public onUpdate(): Observable<object> {
    return new Observable<object> (observer => {
      this.socket.on(this.room, (data:object) => {
        observer.next(data);
      })
    });
  }
}
```
To use this provider anywhere in your project just inport it and declare it in your constructor like this:
```javascript
import { ChannelStatisticsProvider } from '<path-to-your-service-file>';

constructor(public channelProv: ChannelStatisticsProvider) {}
```
Now you can join a room or change to another room like this anywhere in your project:
```javascript
this.channelProv.setRoom("UC-lHJZR3Gqxm24_Vd_AJ5Yw");
```
And to get the data just subscribe to your onUpdate function like this
```javascript
this.channelProv.onUpdate().subscribe((data) => {
   //Object with channel statistics :) Every time you get a new update
   console.log("youtubechanneldata", data); 
})
```


## Donation [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/LukasReiner/) 
If this project help you reduce time to develop, you can give me a cup of coffee (or a Beer of course) :)

[![Support via PayPal](https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg)](https://www.paypal.me/LukasReiner/) 


## Git - Fork

```
$ git clone https://github.com/lreiner/YT-API-Websocket-NodeJS
```
When you fork a project in order to propose changes to the original repository, you can configure Git to pull changes from the original, or upstream, repository into the local clone of your fork.</br >
[Click here to see how to keep a fork synched](https://help.github.com/articles/fork-a-repo/)

## Releases

Too see all published releases, please take a look at the [tags of this repository](https://github.com/lreiner/YT-API-Websocket-NodeJS/tags).
