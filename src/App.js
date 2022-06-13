import React, { useEffect, useRef } from 'react'
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";



// import 'bootstrap/dist/css/bootstrap.min.css'

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});



function App() {
  let videoRef = useRef(null);

  function onResults(results) {
    console.log("onresult")
    // if (videoRef && videoRef.current) {
    //   const canvasElement = videoRef.current;
    //   const canvasCtx = canvasElement.getContext("2d");
    //   // canvasCtx.save();
    //   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //   canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    //   if (results.multiHandLandmarks) {
    //     for (const landmarks of results.multiHandLandmarks) {
    //       drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
    //         { color: '#00FF00', lineWidth: 5 });
    //       drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    //     }
    //   }
    //   canvasCtx.restore();
    // }
  }


  useEffect(() => {
    const getVideo = () => {
      hands.onResults(onResults);
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(async (stream) => {
          if (videoRef && videoRef.current) {
            console.log(videoRef);
            const track = stream.getVideoTracks()[0].clone();
  
            try {
              const imgSrc = new ImageCapture(track);
              while (track.readyState === "live") {
                const imgFrame = await imgSrc.grabFrame();
                const ctx = videoRef.current.getContext("2d");
  
                // ctx.beginPath();
                // ctx.rect(0, 0, videoRef.current.height, videoRef.current.width);
                // ctx.fillStyle = "red";
                // ctx.fill();
                // ctx.drawImage(imgFrame, 100, 100, 200, 200);
  
                ctx.drawImage(imgFrame, 0, 0);
                console.log(imgFrame)
                await hands.send({ image: imgFrame });
              }
            } finally {
              track.stop();
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getVideo();
  }, []);

  return (
    <div className="container">
      <div className='columns'>
        <div className='column is-half'>
          <label>Video Output</label>
          {/* <video ref={videoRef} ></video> */}
          <canvas ref={videoRef} height={500} width={500}></canvas>
        </div>
      </div>
      <br /><br />
    </div>
  );
}

export default App;
