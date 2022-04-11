export default {
  generateRandomString() {
    const crypto = window.crypto || window.msCrypto;
    let array = new Uint32Array(1);

    return crypto.getRandomValues(array);
  },

  closeVideo(elemId) {
    if (document.getElementById(elemId)) {
      document.getElementById(elemId).remove();
      this.adjustVideoElemSize();
    }
  },

  pageHasFocus() {
    return !(
      document.hidden ||
      document.onfocusout ||
      window.onpagehide ||
      window.onblur
    );
  },

  getQString(url = "", keyToReturn = "") {
    url = url ? url : location.href;
    let queryStrings = decodeURIComponent(url)
      .split("#", 2)[0]
      .split("?", 2)[1];

    if (queryStrings) {
      let splittedQStrings = queryStrings.split("&");

      if (splittedQStrings.length) {
        let queryStringObj = {};

        splittedQStrings.forEach(function (keyValuePair) {
          let keyValue = keyValuePair.split("=", 2);

          if (keyValue.length) {
            queryStringObj[keyValue[0]] = keyValue[1];
          }
        });

        return keyToReturn
          ? queryStringObj[keyToReturn]
            ? queryStringObj[keyToReturn]
            : null
          : queryStringObj;
      }

      return null;
    }

    return null;
  },

  userMediaAvailable() {
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  },

  getUserFullMedia() {
    if (this.userMediaAvailable()) {
      return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } else {
      throw new Error("User media not available");
    }
  },

  getUserAudio() {
    if (this.userMediaAvailable()) {
      return navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } else {
      throw new Error("User media not available");
    }
  },

  shareScreen() {
    if (this.userMediaAvailable()) {
      return navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
    } else {
      throw new Error("User media not available");
    }
  },

  getIceServer() {
    return {
      iceServers: [
        {
          urls: [
            "stun.12connect.com:3478",
            "stun.12voip.com:3478",
            "stun.1und1.de:3478",
            "stun.3cx.com:3478",
            "stun.acrobits.cz:3478",
            "stun.actionvoip.com:3478",
            "stun.advfn.com:3478",
            "stun.altar.com.pl:3478",
            "stun.antisip.com:3478",
            "stun.avigora.fr:3478",
            "stun.bluesip.net:3478",
            "stun.cablenet-as.net:3478",
            "stun.callromania.ro:3478",
            "stun.callwithus.com:3478",
            "stun.cheapvoip.com:3478",
            "stun.cloopen.com:3478",
            "stun.commpeak.com:3478",
            "stun.cope.es:3478",
            "stun.counterpath.com:3478",
            "stun.counterpath.net:3478",
            "stun.dcalling.de:3478",
            "stun.demos.ru:3478",
            "stun.dus.net:3478",
            "stun.easycall.pl:3478",
            "stun.easyvoip.com:3478",
            "stun.ekiga.net:3478",
            "stun.epygi.com:3478",
            "stun.etoilediese.fr:3478",
            "stun.faktortel.com.au:3478",
            "stun.freecall.com:3478",
            "stun.freeswitch.org:3478",
            "stun.freevoipdeal.com:3478",
            "stun.gmx.de:3478",
            "stun.gmx.net:3478",
            "stun.halonet.pl:3478",
            "stun.hoiio.com:3478",
            "stun.hosteurope.de:3478",
            "stun.infra.net:3478",
            "stun.internetcalls.com:3478",
            "stun.intervoip.com:3478",
            "stun.ipfire.org:3478",
            "stun.ippi.fr:3478",
            "stun.ipshka.com:3478",
            "stun.it1.hr:3478",
            "stun.ivao.aero:3478",
            "stun.jumblo.com:3478",
            "stun.justvoip.com:3478",
            "stun.l.google.com:19302",
            "stun.linphone.org:3478",
            "stun.liveo.fr:3478",
            "stun.lowratevoip.com:3478",
            "stun.lundimatin.fr:3478",
            "stun.mit.de:3478",
            "stun.miwifi.com:3478",
            "stun.modulus.gr:3478",
            "stun.myvoiptraffic.com:3478",
            "stun.netappel.com:3478",
            "stun.netgsm.com.tr:3478",
            "stun.nfon.net:3478",
            "stun.nonoh.net:3478",
            "stun.nottingham.ac.uk:3478",
            "stun.ooma.com:3478",
            "stun.ozekiphone.com:3478",
            "stun.pjsip.org:3478",
            "stun.poivy.com:3478",
            "stun.powervoip.com:3478",
            "stun.ppdi.com:3478",
            "stun.qq.com:3478",
            "stun.rackco.com:3478",
            "stun.rockenstein.de:3478",
            "stun.rolmail.net:3478",
            "stun.rynga.com:3478",
            "stun.schlund.de:3478",
            "stun.sigmavoip.com:3478",
            "stun.sip.us:3478",
            "stun.sipdiscount.com:3478",
            "stun.sipgate.net:10000",
            "stun.sipgate.net:3478",
            "stun.siplogin.de:3478",
            "stun.sipnet.net:3478",
            "stun.sipnet.ru:3478",
            "stun.sippeer.dk:3478",
            "stun.siptraffic.com:3478",
            "stun.sma.de:3478",
            "stun.smartvoip.com:3478",
            "stun.smsdiscount.com:3478",
            "stun.solcon.nl:3478",
            "stun.solnet.ch:3478",
            "stun.sonetel.com:3478",
            "stun.sonetel.net:3478",
            "stun.sovtest.ru:3478",
            "stun.srce.hr:3478",
            "stun.stunprotocol.org:3478",
            "stun.t-online.de:3478",
            "stun.tel.lu:3478",
            "stun.telbo.com:3478",
            "stun.tng.de:3478",
            "stun.twt.it:3478",
            "stun.uls.co.za:3478",
            "stun.unseen.is:3478",
            "stun.usfamily.net:3478",
            "stun.viva.gr:3478",
            "stun.vivox.com:3478",
            "stun.vo.lu:3478",
            "stun.voicetrading.com:3478",
            "stun.voip.aebc.com:3478",
            "stun.voip.blackberry.com:3478",
            "stun.voip.eutelia.it:3478",
            "stun.voipblast.com:3478",
            "stun.voipbuster.com:3478",
            "stun.voipbusterpro.com:3478",
            "stun.voipcheap.co.uk:3478",
            "stun.voipcheap.com:3478",
            "stun.voipgain.com:3478",
            "stun.voipgate.com:3478",
            "stun.voipinfocenter.com:3478",
            "stun.voipplanet.nl:3478",
            "stun.voippro.com:3478",
            "stun.voipraider.com:3478",
            "stun.voipstunt.com:3478",
            "stun.voipwise.com:3478",
            "stun.voipzoom.com:3478",
            "stun.voys.nl:3478",
            "stun.voztele.com:3478",
            "stun.webcalldirect.com:3478",
            "stun.wifirst.net:3478",
            "stun.xtratelecom.es:3478",
            "stun.zadarma.com:3478",
            "stun1.faktortel.com.au:3478",
            "stun1.l.google.com:19302",
            "stun2.l.google.com:19302",
            "stun3.l.google.com:19302",
            "stun4.l.google.com:19302",
            "stun.nextcloud.com:443",
          ],
        },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443?transport=tcp",
          username: "openrelayproject",
          credential: "openrelayproject",
        },

        // { url: "stun:stun.l.google.com:19302" },
        // { url: "stun:stun1.l.google.com:19302" },
        // { url: "stun:stun2.l.google.com:19302" },
        // { url: "stun:stun3.l.google.com:19302" },
        // { url: "stun:stun4.l.google.com:19302" },

        // {
        //   urls: "stun:openrelay.metered.ca:80",
        // },
        // {
        //   urls: "turn:openrelay.metered.ca:80",
        //   username: "openrelayproject",
        //   credential: "openrelayproject",
        // },
        // {
        //   urls: "turn:openrelay.metered.ca:443",
        //   username: "openrelayproject",
        //   credential: "openrelayproject",
        // },
        // {
        //   urls: "turn:openrelay.metered.ca:443?transport=tcp",
        //   username: "openrelayproject",
        //   credential: "openrelayproject",
        // },

        // { url: "stun:stun.l.google.com:19302" },
        // { url: "turn:homeo@turn.bistri.com:80", credential: "homeo" },
        // {
        //   urls: [
        //     "stun:stun1.l.google.com:19302?transport=udp",
        //     "stun:stun2.l.google.com:19302?transport=udp",
        //     "stun:stun1.l.google.com:19302?transport=tcp",
        //     "stun:stun2.l.google.com:19302?transport=tcp",
        //   ],
        // },
        // {
        //   urls: ["stun:eu-turn4.xirsys.com"],
        // },
        // {
        //   username:
        //     "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
        //   credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
        //   urls: [
        //     "turn:eu-turn4.xirsys.com:80?transport=udp",
        //     "turn:eu-turn4.xirsys.com:3478?transport=tcp",
        //   ],
        // },
      ],
    };
  },

  addChat(data, senderType) {
    let chatMsgDiv = document.querySelector("#chat-messages");
    let contentAlign = "justify-content-end";
    let senderName = "You";
    let msgBg = "bg-white";

    if (senderType === "remote") {
      contentAlign = "justify-content-start";
      senderName = data.sender;
      msgBg = "";

      this.toggleChatNotificationBadge();
    }

    let infoDiv = document.createElement("div");
    infoDiv.className = "sender-info";
    infoDiv.innerText = `${senderName} - ${moment().format(
      "Do MMMM, YYYY h:mm a"
    )}`;

    let colDiv = document.createElement("div");
    colDiv.className = `col-10 card chat-card msg ${msgBg}`;
    colDiv.innerHTML = xssFilters
      .inHTMLData(data.msg)
      .autoLink({ target: "_blank", rel: "nofollow" });

    let rowDiv = document.createElement("div");
    rowDiv.className = `row ${contentAlign} mb-2`;

    colDiv.appendChild(infoDiv);
    rowDiv.appendChild(colDiv);

    chatMsgDiv.appendChild(rowDiv);

    /**
     * Move focus to the newly added message but only if:
     * 1. Page has focus
     * 2. User has not moved scrollbar upward. This is to prevent moving the scroll position if user is reading previous messages.
     */
    if (this.pageHasFocus) {
      rowDiv.scrollIntoView();
    }
  },

  toggleChatNotificationBadge() {
    if (
      document.querySelector("#chat-pane").classList.contains("chat-opened")
    ) {
      document
        .querySelector("#new-chat-notification")
        .setAttribute("hidden", true);
    } else {
      document
        .querySelector("#new-chat-notification")
        .removeAttribute("hidden");
    }
  },

  replaceTrack(stream, recipientPeer) {
    let sender = recipientPeer.getSenders
      ? recipientPeer
          .getSenders()
          .find((s) => s.track && s.track.kind === stream.kind)
      : false;

    sender ? sender.replaceTrack(stream) : "";
  },

  toggleShareIcons(share) {
    let shareIconElem = document.querySelector("#share-screen");

    if (share) {
      shareIconElem.setAttribute("title", "Stop sharing screen");
      shareIconElem.children[0].classList.add("text-primary");
      shareIconElem.children[0].classList.remove("text-white");
    } else {
      shareIconElem.setAttribute("title", "Share screen");
      shareIconElem.children[0].classList.add("text-white");
      shareIconElem.children[0].classList.remove("text-primary");
    }
  },

  toggleVideoBtnDisabled(disabled) {
    document.getElementById("toggle-video").disabled = disabled;
  },

  maximiseStream(e) {
    let elem = e.target.parentElement.previousElementSibling;

    elem.requestFullscreen() ||
      elem.mozRequestFullScreen() ||
      elem.webkitRequestFullscreen() ||
      elem.msRequestFullscreen();
  },

  singleStreamToggleMute(e) {
    if (e.target.classList.contains("fa-microphone")) {
      e.target.parentElement.previousElementSibling.muted = true;
      e.target.classList.add("fa-microphone-slash");
      e.target.classList.remove("fa-microphone");
    } else {
      e.target.parentElement.previousElementSibling.muted = false;
      e.target.classList.add("fa-microphone");
      e.target.classList.remove("fa-microphone-slash");
    }
  },

  saveRecordedStream(stream, user) {
    let blob = new Blob(stream, { type: "video/mp4" });

    let file = new File([blob], `${user}-${moment().unix()}-record.mp4`);

    saveAs(file);
  },

  toggleModal(id, show) {
    let el = document.getElementById(id);

    if (show) {
      el.style.display = "block";
      el.removeAttribute("aria-hidden");
    } else {
      el.style.display = "none";
      el.setAttribute("aria-hidden", true);
    }
  },

  setLocalStream(stream, mirrorMode = true) {
    const localVidElem = document.getElementById("local");

    localVidElem.srcObject = stream;
    mirrorMode
      ? localVidElem.classList.add("mirror-mode")
      : localVidElem.classList.remove("mirror-mode");
  },

  adjustVideoElemSize() {
    let elem = document.getElementsByClassName("card");
    let totalRemoteVideosDesktop = elem.length;
    let newWidth =
      totalRemoteVideosDesktop <= 2
        ? "50%"
        : totalRemoteVideosDesktop == 3
        ? "33.33%"
        : totalRemoteVideosDesktop <= 8
        ? "25%"
        : totalRemoteVideosDesktop <= 15
        ? "20%"
        : totalRemoteVideosDesktop <= 18
        ? "16%"
        : totalRemoteVideosDesktop <= 23
        ? "15%"
        : totalRemoteVideosDesktop <= 32
        ? "12%"
        : "10%";

    for (let i = 0; i < totalRemoteVideosDesktop; i++) {
      elem[i].style.width = newWidth;
    }
  },

  createDemoRemotes(str, total = 6) {
    let i = 0;

    let testInterval = setInterval(() => {
      let newVid = document.createElement("video");
      newVid.id = `demo-${i}-video`;
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
      cardDiv.id = `demo-${i}`;
      cardDiv.appendChild(newVid);
      cardDiv.appendChild(controlDiv);

      //put div in main-section elem
      document.getElementById("videos").appendChild(cardDiv);

      this.adjustVideoElemSize();

      i++;

      if (i == total) {
        clearInterval(testInterval);
      }
    }, 2000);
  },
};
