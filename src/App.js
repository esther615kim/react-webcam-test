
import './App.css';
import { useEffect, useRef } from 'react';
import {Button,ButtonGroup } from "@mui/material"
import { io } from 'socket.io-client';

const socket = io(
  '/webRTCPeers',
  {
    path:'/webrtc'
  }
)

function App() {

  const localvideoRef = useRef();
  const remotevideoRef = useRef();
  const pcRef = useRef(new RTCPeerConnection(null));
  const textRef = useRef();

  useEffect(()=>{
    
    socket.on('connection-success',success =>{
      console.log(success);
    })
    const options = {
      audio:false,
      video:true,
    }

    navigator.mediaDevices.getUserMedia(options)
    .then(stream=>{
      //display video
      localvideoRef.current.srcObject =stream
    })
    .catch(e=>
      console.log("getUserMedia error"))

      const pc1 = new RTCPeerConnection(null);
      pc1.onlicecandidate =(e)=>{
        if(e.candidate)
        console.log(JSON.stringify(e.candidate));
      }

      pc1.oniceconnectionstatechange =(e) =>{
        console.log(e);
      }

      pc1.ontrack= (e)=>{
        // get remote stream
      }

      pcRef.current = pc1;

  },[])

  const createSDP =() =>{
    pcRef.current.createOffer({
      offerToRecieveAudio:0,
      offerToReceiveVideo:1

    }).then(sdp =>{
      console.log(JSON.stringify(sdp))
      pcRef.current.setLocalDescription(sdp);
    }).catch(e=> console.log(e));
  }

  const answerSDP=()=>{
    pcRef.current.answerOffer({
      offerToRecieveAudio:0,
      offerToReceiveVideo:1

    }).then(sdp =>{
      console.log(JSON.stringify(sdp))
      pcRef.current.setLocalDescription(sdp);
    }).catch(e=> console.log(e));

  }

  const setRemoteDescription = ()=>{
    // get SDP key from text
    const sdp = JSON.parse(textRef.current.value);
    console.log("sdp",sdp);
    pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  const addCandidate = ()=>{
    const candidate = JSON.parse(textRef.current.value);
    console.log("candidate",candidate)
//peerconnection
    pcRef.current.addIceCandidate(new RTCSessionDescription(candidate));

  }

  return (
    <div className="App" style={{padding:"2rem",margin:"0 auto"}}>
      <div style={{background:"skyblue",padding:"2rem", borderRadius:"5px"}}>
        <h3>Web RTC Testing App🎉</h3>
        <video className="video" ref={remotevideoRef} autoPlay style={{width:300,height:240,margin:10}}></video>
        <video className="video" ref={localvideoRef} autoPlay style={{width:300,height:240,margin:10}} ></video>
<br/>
<ButtonGroup mt={5} variant="contained">
  {/* <Button color="warning" onClick={()=>{
          getUserMedia();
        }}>New Meeting</Button> */}
  <Button onClick={createSDP}>Create SDP  </Button>
  <Button onClick={answerSDP}>Offer SDP</Button>
  <br/>
  <Button onClick={setRemoteDescription}>R.D</Button>
  <Button onClick={addCandidate}>Add C</Button>
</ButtonGroup>
              </div>
              <br/>
              <div >
                <textarea ref={textRef} cols="50" rows="20"></textarea>
              </div>
    </div>
  );
}

export default App;
