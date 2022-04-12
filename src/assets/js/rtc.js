/**
 * @author Amir Sanni <amirsanni@gmail.com>
 * @date 6th January, 2020
 */
import h from "./helpers.js";

window.addEventListener("load", () => {
  const room = h.getQString(location.href, "room");
  const username = sessionStorage.getItem("username");
  if (!room) {
    document.querySelector("#room-create").attributes.removeNamedItem("hidden");
  } else if (!username) {
    document
      .querySelector("#username-set")
      .attributes.removeNamedItem("hidden");
  } else {
    let commElem = document.getElementsByClassName("room-comm");

    for (let i = 0; i < commElem.length; i++) {
      commElem[i].attributes.removeNamedItem("hidden");
    }

    var pc = [];

    let socket = io("/stream");

    var socketId = "";
    var randomNumber = `__${h.generateRandomString()}__${h.generateRandomString()}__`;
    var myStream = "";
    var testStream = [];
    var screen = "";
    var recordedStream = [];
    var mediaRecorder = "";

    function test() {
      setTimeout(() => {
        console.log(pc);
        test();
      }, 2000);
    }
    test();

    //Get user video by default
    getAndSetUserStream();

    socket.on("connect", () => {
      //set socketId
      socketId = socket.io.engine.id;
      document.getElementById("randomNumber").innerText = randomNumber;

      // first event.
      socket.emit("subscribe", {
        room: room,
        socketId: socketId,
      });

      // new  user notification to this user
      socket.on("new user", (data) => {
        console.log("old user");
        // send own socket id to new added user.
        socket.emit("newUserStart", { to: data.socketId, sender: socketId });
        pc.push(data.socketId);
        init(true, data.socketId);
      });

      // if this is new user then all other old user socket id will we get.
      socket.on("newUserStart", (data) => {
        console.log("newUserStart");
        pc.push(data.sender);
        init(false, data.sender);
      });

      socket.on("ice candidates", async (data) => {
        data.candidate
          ? await pc[data.sender].addIceCandidate(
              new RTCIceCandidate(data.candidate)
            )
          : "";
      });

      socket.on("sdp", async (data) => {
        if (data.description.type === "offer") {
          data.description
            ? await pc[data.sender].setRemoteDescription(
                new RTCSessionDescription(data.description)
              )
            : "";

          h.getUserFullMedia()
            .then(async (stream) => {
              if (!document.getElementById("local").srcObject) {
                h.setLocalStream(stream);
              }

              //save my stream
              myStream = stream;
              testStream.push(stream);

              stream.getTracks().forEach((track) => {
                pc[data.sender].addTrack(track, stream);
              });

              let answer = await pc[data.sender].createAnswer();

              await pc[data.sender].setLocalDescription(answer);
              // alert(pc[data.sender].localDescription.sdp);
              console.log("localDescription", pc[data.sender].localDescription);
              socket.emit("sdp", {
                description: pc[data.sender].localDescription,
                to: data.sender,
                sender: socketId,
              });
            })
            .catch((e) => {
              console.error(e);
            });
        } else if (data.description.type === "answer") {
          await pc[data.sender].setRemoteDescription(
            new RTCSessionDescription(data.description)
          );
        }
      });

      socket.on("chat", (data) => {
        h.addChat(data, "remote");
      });
    });

    function getAndSetUserStream() {
      debugger;
      h.getUserFullMedia()
        .then((stream) => {
          //save my stream
          myStream = stream;
          testStream.push(stream);

          h.setLocalStream(stream);
        })
        .catch((e) => {
          console.error(`stream error: ${e}`);
        });
    }

    function sendMsg(msg) {
      let data = {
        room: room,
        msg: msg,
        sender: `${username} (${randomNumber})`,
      };

      //emit chat message
      socket.emit("chat", data);

      //add localchat
      h.addChat(data, "local");
    }

    function init(createOffer, partnerName) {
      pc[partnerName] = new RTCPeerConnection(h.getIceServer());
      // console.log(screen);

      if (screen && screen.getTracks().length) {
        screen.getTracks().forEach((track) => {
          pc[partnerName].addTrack(track, screen);
          // console.log(track); //should trigger negotiationneeded event
        });
      } else if (myStream) {
        // when only camera is on
        myStream.getTracks().forEach((track) => {
          // console.log(track);
          pc[partnerName].addTrack(track, myStream); //should trigger negotiationneeded event
        });
      } else {
        h.getUserFullMedia()
          .then((stream) => {
            //save my stream
            myStream = stream;
            testStream.push(stream);

            stream.getTracks().forEach((track) => {
              // console.log(track);
              pc[partnerName].addTrack(track, stream); //should trigger negotiationneeded event
            });

            h.setLocalStream(stream);
          })
          .catch((e) => {
            console.error(`stream error: ${e}`);
          });
      }

      //create offer
      if (createOffer) {
        pc[partnerName].onnegotiationneeded = async () => {
          let offer = await pc[partnerName].createOffer();

          await pc[partnerName].setLocalDescription(offer);

          socket.emit("sdp", {
            description: pc[partnerName].localDescription,
            to: partnerName,
            sender: socketId,
          });
        };
      }

      // http://localhost:3000/?room=111_728759672

      //send ice candidate to partnerNames
      pc[partnerName].onicecandidate = ({ candidate }) => {
        console.log("onicecandidate", candidate);
        socket.emit("ice candidates", {
          candidate: candidate,
          to: partnerName,
          sender: socketId,
        });
      };

      //add
      pc[partnerName].ontrack = (e) => {
        console.log("e.streams[0]", e.streams[0]);
        let str = e.streams[0];
        testStream.push(str);

        if (document.getElementById(`${partnerName}-video`)) {
          document.getElementById(`${partnerName}-video`).srcObject = str;
        } else {
          //video elem
          let newVid = document.createElement("video");
          newVid.id = `${partnerName}-video`;
          newVid.srcObject = str;
          newVid.autoplay = true;
          newVid.className = "remote-video";

          //video controls elements
          let controlDiv = document.createElement("div");
          controlDiv.className = "remote-video-controls";
          controlDiv.innerHTML = `<i class="fa fa-microphone text-white pr-3 mute-remote-mic" title="Mute"></i>
                        <i class="fa fa-expand text-white expand-remote-video" title="Expand"></i>`;

          //create a new div for card
          let cardDiv = document.createElement("div");
          cardDiv.className = "card card-sm";
          cardDiv.id = partnerName;
          cardDiv.appendChild(newVid);
          cardDiv.appendChild(controlDiv);

          //put div in main-section elem
          document.getElementById("videos").appendChild(cardDiv);

          h.adjustVideoElemSize();
        }
      };

      pc[partnerName].onconnectionstatechange = (d) => {
        console.log("onconnectionstatechange", d);
        switch (pc[partnerName].iceConnectionState) {
          case "disconnected":
          case "failed":
            h.closeVideo(partnerName);
            pc[partnerName].close();
            delete pc[partnerName];
            break;

          case "closed":
            h.closeVideo(partnerName);
            pc[partnerName].close();
            delete pc[partnerName];
            break;
        }
      };

      pc[partnerName].onsignalingstatechange = (d) => {
        console.log("onsignalingstatechange", d);
        switch (pc[partnerName].signalingState) {
          case "closed":
            console.log("Signalling state is 'closed'");
            h.closeVideo(partnerName);
            pc[partnerName].close();
            delete pc[partnerName];
            break;
        }
      };
    }

    function shareScreen() {
      h.shareScreen()
        .then((stream) => {
          h.toggleShareIcons(true);

          //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
          //It will be enabled was user stopped sharing screen
          h.toggleVideoBtnDisabled(true);

          //save my screen streamweb
          screen = stream;

          //share the new stream with all partners
          broadcastNewTracks(stream, "video", false);

          //When the stop sharing button shown by the browser is clicked
          screen.getVideoTracks()[0].addEventListener("ended", () => {
            stopSharingScreen();
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }

    function stopSharingScreen() {
      //enable video toggle btn
      h.toggleVideoBtnDisabled(false);

      return new Promise((res, rej) => {
        screen.getTracks().length
          ? screen.getTracks().forEach((track) => track.stop())
          : "";

        res();
      })
        .then(() => {
          h.toggleShareIcons(false);
          broadcastNewTracks(myStream, "video");
        })
        .catch((e) => {
          console.error(e);
        });
    }

    function broadcastNewTracks(stream, type, mirrorMode = true) {
      h.setLocalStream(stream, mirrorMode);

      let track =
        type == "audio"
          ? stream.getAudioTracks()[0]
          : stream.getVideoTracks()[0];

      for (let p in pc) {
        let pName = pc[p];

        if (typeof pc[pName] == "object") {
          h.replaceTrack(track, pc[pName]);
        }
      }
    }

    function toggleRecordingIcons(isRecording) {
      let e = document.getElementById("record");

      if (isRecording) {
        e.setAttribute("title", "Stop recording");
        e.children[0].classList.add("text-danger");
        e.children[0].classList.remove("text-white");
      } else {
        e.setAttribute("title", "Record");
        e.children[0].classList.add("text-white");
        e.children[0].classList.remove("text-danger");
      }
    }

    function startRecording(stream) {
      mediaRecorder = new MediaRecorder(stream, {
        // mimeType: "video/webm;codecs=vp9",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        // mimeType: "video/mp4",
      });

      mediaRecorder.start(1000);
      toggleRecordingIcons(true);

      mediaRecorder.ondataavailable = function (e) {
        recordedStream.push(e.data);
        console.log(e.data);
      };

      mediaRecorder.onstop = function () {
        toggleRecordingIcons(false);

        h.saveRecordedStream(recordedStream, username);

        setTimeout(() => {
          recordedStream = [];
        }, 3000);
      };

      mediaRecorder.onerror = function (e) {
        console.error(e);
      };
    }

    document.getElementById("chat-input-btn").addEventListener("click", (e) => {
      console.log("here: ", document.getElementById("chat-input").value);
      if (document.getElementById("chat-input").value.trim()) {
        sendMsg(document.getElementById("chat-input").value);

        setTimeout(() => {
          document.getElementById("chat-input").value = "";
        }, 50);
      }
    });

    //Chat textarea
    document.getElementById("chat-input").addEventListener("keypress", (e) => {
      if (e.which === 13 && e.target.value.trim()) {
        e.preventDefault();

        sendMsg(e.target.value);

        setTimeout(() => {
          e.target.value = "";
        }, 50);
      }
    });

    //When the video icon is clicked
    document.getElementById("toggle-video").addEventListener("click", (e) => {
      e.preventDefault();

      let elem = document.getElementById("toggle-video");

      if (myStream.getVideoTracks()[0].enabled) {
        e.target.classList.remove("fa-video");
        e.target.classList.add("fa-video-slash");
        elem.setAttribute("title", "Show Video");

        myStream.getVideoTracks()[0].enabled = false;
      } else {
        e.target.classList.remove("fa-video-slash");
        e.target.classList.add("fa-video");
        elem.setAttribute("title", "Hide Video");

        myStream.getVideoTracks()[0].enabled = true;
      }

      broadcastNewTracks(myStream, "video");
    });

    function createMergedStream(streams) {
      const audioContext = new AudioContext();

      const audioSources = [];
      const videoTracks = [];

      streams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          if (track.kind === "video") {
            videoTracks.push(track);
          }
          if (track.kind === "audio") {
            audioSources.push(audioContext.createMediaStreamSource(stream));
          }
        });
      });

      const destination = audioContext["createMediaStreamDestination"]();
      audioSources.forEach((audioSource) => {
        audioSource.connect(destination);
      });

      videoTracks.forEach((track) => {
        destination.stream.addTrack(track);
      });

      return destination.stream;
    }

    //When the mute icon is clicked
    document.getElementById("toggle-mute").addEventListener("click", (e) => {
      e.preventDefault();

      let elem = document.getElementById("toggle-mute");

      if (myStream.getAudioTracks()[0].enabled) {
        e.target.classList.remove("fa-microphone-alt");
        e.target.classList.add("fa-microphone-alt-slash");
        elem.setAttribute("title", "Unmute");

        myStream.getAudioTracks()[0].enabled = false;
      } else {
        e.target.classList.remove("fa-microphone-alt-slash");
        e.target.classList.add("fa-microphone-alt");
        elem.setAttribute("title", "Mute");

        myStream.getAudioTracks()[0].enabled = true;
      }

      broadcastNewTracks(myStream, "audio");
    });

    //When user clicks the 'Share screen' button
    document.getElementById("share-screen").addEventListener("click", (e) => {
      e.preventDefault();

      if (
        screen &&
        screen.getVideoTracks().length &&
        screen.getVideoTracks()[0].readyState != "ended"
      ) {
        stopSharingScreen();
      } else {
        shareScreen();
      }
    });

    //When record button is clicked
    document.getElementById("record").addEventListener("click", (e) => {
      /**
       * Ask user what they want to record.
       * Get the stream based on selection and start recording
       */
      if (!mediaRecorder || mediaRecorder.state == "inactive") {
        h.toggleModal("recording-options-modal", true);
      } else if (mediaRecorder.state == "paused") {
        mediaRecorder.resume();
      } else if (mediaRecorder.state == "recording") {
        mediaRecorder.stop();
      }
    });

    //When user choose to record screen
    document.getElementById("record-screen").addEventListener("click", () => {
      h.toggleModal("recording-options-modal", false);

      if (screen && screen.getVideoTracks().length) {
        startRecording(createMergedStream([screen, ...testStream]));
      } else {
        h.shareScreen()
          .then((screenStream) => {
            startRecording(createMergedStream([screenStream, ...testStream]));
          })
          .catch(() => {});
      }
    });

    //When user choose to record own video
    document.getElementById("record-video").addEventListener("click", () => {
      h.toggleModal("recording-options-modal", false);

      if (myStream && myStream.getTracks().length) {
        startRecording(createMergedStream(testStream));
      } else {
        h.getUserFullMedia()
          .then((videoStream) => {
            startRecording(createMergedStream(testStream));
          })
          .catch(() => {});
      }
    });
  }
});
