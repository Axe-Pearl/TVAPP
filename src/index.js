window.onload = function () {
    document.getElementById("isLoading").innerHTML = "Application loaded !!";
    hcap.socket.openTcpDaemon({
        "port": 9312,
        "onSuccess": function () {
            console.log("onSuccess");
            document.getElementById("isOpen").innerHTML = "Success TCP Daemon is Open";
        },
        "onFailure": function (f) {
            console.log("onFailure : errorMessage = " + f.errorMessage);
            document.getElementById("isOpen").innerHTML = "Failure TCP Daemon failed to Open" + f.errorMessage;
        }
    });
}

document.addEventListener(
    "tcp_data_received",
    function (param) {
        try {
            document.getElementById("result").innerHTML="Receive data on socket, Data: " + String(param.data); 
            var receiveData = String(param.data.trim());
            if (receiveData.length == 0) return false;
            var arr = receiveData.split(':');
            var param1 = arr[1];
            var param2 = arr[2];
            if(param1 !== undefined && param1!== null){
                document.getElementById("thisIP").innerHTML = "Param1: " + param1;
            }
            if(param2 !== undefined && param2 !== null){
                document.getElementById("thisPort").innerHTML = "Param2: " + param2;
            }
            document.getElementById("check").innerHTML = "Listening...";
            document.getElementById("isListening").innerHTML = "Port: " + param.port;
            document.getElementById("portData").innerHTML = "Passed command: " + receiveData;

            // will fetch the current volume
            if(receiveData == 'GET_VOLUME'){
                hcap.volume.getVolumeLevel({
                    "onSuccess": function (s) {
                         console.log("onSuccess : level = " + s.level);
                         document.getElementById("commandResult").innerHTML = "Current Volume: " + s.level;
                     },
                     "onFailure": function (f) {
                         console.log("onFailure : errorMessage = " + f.errorMessage);
                         document.getElementById("commandResult").innerHTML = f.errorMessage;
                     }
                 });
            }  
            //will play current channel
            if(arr[0] == "PLAY_CHANNEL"){
                hcap.channel.requestChangeCurrentChannel({
                    "channelType" : hcap.channel.ChannelType.IP, 
                    "ip" : param1,
                    "port" : parseInt(param2),
                    "ipBroadcastType" : hcap.channel.IpBroadcastType.UDP, 
                    "onSuccess" : function() {
                        console.log("onSuccess");
                    }, 
                    "onFailure" : function(f) {
                        document.getElementById("commandResult").innerHTML = "Error: " + f.errorMessage;
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                    }
               });
            }      

            // will set the volume
            if(arr[0] == "SET_VOLUME"){
                hcap.volume.setVolumeLevel({
                    "level" : parseInt(param1), 
                    "onSuccess" : function() {
                        console.log("onSuccess");
                        hcap.volume.getVolumeLevel({
                            "onSuccess": function (s) {
                                 console.log("onSuccess : level = " + s.level);
                                 document.getElementById("commandResult").innerHTML = "Current Volume: " + s.level;
                             },
                             "onFailure": function (f) {
                                 console.log("onFailure : errorMessage = " + f.errorMessage);
                                 document.getElementById("commandResult").innerHTML = f.errorMessage;
                             }
                         });
                     }, 
                    "onFailure" : function(f) {
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                    }
               });
            }  
             if(arr[0] == "SETOFFON"){
                hcap.time.setPowerOffTimer({
                    "minute" : parseInt(param1),
                    "onSuccess" : function() {
                        console.log("onSuccess");
                    }, 
                    "onFailure" : function(f) {
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                    }
               });               
             }
            // will fetch power mode of TV
            if(receiveData  == "POWER_MODE"){
                hcap.power.getPowerMode({
                    "onSuccess" : function(s) {
                        console.log("onSuccess power mode " + s.mode);
                        document.getElementById("commandResult").innerHTML = "Current Mode of the TV: " + s.mode;
                    }, 
                    "onFailure" : function(f) {
                        document.getElementById("commandResult").innerHTML = "Error: " + f.errorMessage;
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                    }
               });
            }

            //will turn off the TV
            if(receiveData == "TURNOFF"){
                hcap.power.powerOff({
                    "onSuccess" : function() {
                        console.log("onSuccess");
                        document.getElementById("commandResult").innerHTML = "Turning off....";
                    }, 
                    "onFailure" : function(f) {
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                        document.getElementById("commandResult").innerHTML = "Error: " + f.errorMessage;
                    }
               });
            }

            //will reboot the TV
            if(receiveData == "REBOOT"){
                hcap.power.reboot({
                    "onSuccess" : function() {
                        console.log("onSuccess");
                        document.getElementById("commandResult").innerHTML = "Rebooted";
                    }, 
                    "onFailure" : function(f) {
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                        document.getElementById("commandResult").innerHTML = "Error: " + f.errorMessage;
                    }
               });
               
            }

            // will get the current channel information
            if(receiveData == "CURRENT_CHANNEL"){
                hcap.channel.getCurrentChannel({
                    "onSuccess" : function(s) {
                        document.getElementById("commandResult").innerHTML = "Channel Status: " + s.channelStatus + " Channel Type: " + s.channelType + "Program number: " + s.programNumber; 
                        console.log("onSuccess :" + 
                            "\n channel status    : " + s.channelStatus   +
                            "\n channel type      : " + s.channelType     +
                            "\n logical number    : " + s.logicalNumber   +
                            "\n frequency         : " + s.frequency       +
                            "\n program number    : " + s.programNumber   +
                            "\n major number      : " + s.majorNumber     +
                            "\n minor number      : " + s.minorNumber     +
                            "\n satellite ID      : " + s.satelliteId     +
                            "\n polarization      : " + s.polarization    +
                            "\n rf broadcast type : " + s.rfBroadcastType +
                            "\n ip                : " + s.ip              +
                            "\n port              : " + s.port            +
                            "\n ip broadcast type : " + s.ipBroadcastType +
                            "\n symbol rate       : " + s.symbolRate      +
                            "\n pcr pid           : " + s.pcrPid          +
                            "\n video pid         : " + s.videoPid        +
                            "\n video stream type : " + s.videoStreamType +
                            "\n audio pid         : " + s.audioPid        +
                            "\n audio stream type : " + s.audioStreamType +
                            "\n signal strength   : " + s.signalStrength  +
                            "\n source address    : " + s.sourceAddress);
                    }, 
                    "onFailure" : function(f) {
                        document.getElementById("commandResult").innerHTML = "Error: " + f.errorMessage;
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                    }
               });
            }
            if(receiveData == "ISMUTE"){
                hcap.video.isVideoMute({
                    "onSuccess" : function(s) {
                        document.getElementById("commandResult").innerHTML = s.videoMute;
                        console.log("onSuccess : videoMute = " + s.videoMute);
                    }, 
                    "onFailure" : function(f) {
                        console.log("onFailure : errorMessage = " + f.errorMessage);
                    }
               });
            }

            document.addEventListener(
                "channel_status_changed",
                function yourEventListener() {
                    document.getElementById("check").innerHTML = "Channel Changed";
                    hcap.channel.getCurrentChannel({
                        "onSuccess" : function(s) {
                            document.getElementById("check").innerHTML = "Listened";
                            document.getElementById("commandResult").innerHTML = "Done: Channel Status: " + s.channelStatus + " Channel Type: " + s.channelType + "Program number: " + s.programNumber; 
                        }, 
                        "onFailure" : function(f) {
                            document.getElementById("commandResult").innerHTML = "Error: " + f.errorMessage;
                            console.log("onFailure : errorMessage = " + f.errorMessage);
                        }
                   });
                    console.log(
                        "Event 'channel_status_changed' is received"
                    ); 
                },
                false
           );
        } catch(e) {
            document.getElementById("result").innerHTML="ERROR :: Exception occurred on receive socket command : " + e.message;
        }      
    },
    false
);