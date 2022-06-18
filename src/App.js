import React, { useEffect, useRef, useState } from 'react'
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import "./App.css";
import MLLoader from './tfjsml';



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

const mlloader = new MLLoader();

function App() {
  let [output, setOutput] = useState("");
  let videoRef = useRef(null);

  async function onResults(results) {
    // console.log("onresult")
    if (videoRef && videoRef.current) {
      const canvasElement = videoRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      // canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // capture realtime video
      // canvasCtx.drawImage(
      //   results.image, 0, 0, canvasElement.width, canvasElement.height);  
      //
      canvasCtx.beginPath();
      canvasCtx.rect(0, 0, videoRef.current.height, videoRef.current.width);
      canvasCtx.fillStyle = "black";
      canvasCtx.fill();

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
            { color: '#FFFFFF', lineWidth: 5 });
          drawLandmarks(canvasCtx, landmarks, { color: '#FFFFFF', lineWidth: 2 });
        }
      }
      canvasCtx.restore();
      const output = await mlloader.runInference(videoRef.current);
      console.log(output)
      setOutput(output)
    }
  }


  useEffect(() => {
    async function loadModel() {
      await mlloader.loadModel("mobilenetv2_4_class_minimal/model.json");
      console.log(mlloader.model);
    }
    loadModel();

    const getVideo = () => {
      hands.onResults(onResults);
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(async (stream) => {
          if (videoRef && videoRef.current) {
            // console.log(videoRef);
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
                // console.log(imgFrame)
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
          <label>{output}</label>
          {/* <video ref={videoRef} ></video> */}
          <canvas ref={videoRef} height={500} width={500}></canvas>
        </div>
      </div>
      <br /><br />
    </div>
  );
}

export default App;
