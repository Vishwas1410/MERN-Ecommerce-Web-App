import react, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
const CameraCanvas = () => {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const runBodySegmentation = async () => {
      const net = await bodyPix.load();
      console.log("body Pix Loaded");
      setInterval(()=>{
        detect(net);
      },1);
      // detect(net);
  
    }
    
    const detect = async (net) => {
      if (
        typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoHeight = video.videoHeight;
        const videoWidth = video.videoWidth;
        webcamRef.current.video.height = videoHeight;
        webcamRef.current.video.width = videoWidth;
  
  
        canvasRef.current.height = videoHeight;
        canvasRef.current.width = videoWidth;
  
  
  
        const person = await net.segmentPersonParts(video);
        console.log(person);
  
  
        const coloredBodyPartsImage = bodyPix.toColoredPartMask(person);
  
        bodyPix.drawMask(canvasRef.current,
          video,
          coloredBodyPartsImage,
          0.7,
          0,
          false
        )
        
      }
  
    }
    runBodySegmentation();



    return (
<div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
          style={{

            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas ref={canvasRef}
          style={{

            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
      </header>
    </div>
    )
}

export default CameraCanvas
