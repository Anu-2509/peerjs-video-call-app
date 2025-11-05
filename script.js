const peer = new Peer();

// select all the elements
const peerIdDisplay = document.getElementById("peer-id");
const connectInput = document.getElementById("connect-to-id");
const callBtn = document.getElementById("call-btn");
const endCallBtn = document.getElementById("end-call-btn");
const myVideo = document.getElementById("my-video");
const partnerVideo = document.getElementById("partner-video");

let localstream;
let call;
// 1sr step -> both side peer id display

peer.on("open", (id) => {
    peerIdDisplay.textContent = id;
})

//2nd step --> mujhe meri localstream mil chuki hai

async function getMediaStream () {
    try {
         localstream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        myVideo.srcObject = localstream;
    } catch (error) {
        console.error("Error accessing camera/microphone:", error);
        alert("Could not access camera or microphone.");
    }
}
getMediaStream();

// sender side

callBtn.addEventListener("click", () => {
    const friendId = connectInput.value;
    call = peer.call(friendId, localstream);

    call.on("stream", (friendStream) => {
        partnerVideo.srcObject = friendStream;
    })

    call.on("close", () => {
        partnerVideo.srcObject = null;
    })
})

// friend ki side mere frnd ke liye me remote hu
peer.on("call", (incomingCall) => {
    call = incomingCall;

    console.log("Incoming call ->",incomingCall);
    incomingCall.answer(localstream);

    incomingCall.on("stream", (friendStream) => {
        partnerVideo.srcObject = friendStream;
    })

    incomingCall.on("close", () => {
        partnerVideo.srcObject = null;
    })
})

endCallBtn.addEventListener("click", () => {
    if(call){
     call.close();
    }
        
})