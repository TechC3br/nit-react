import "@tensorflow/tfjs-backend-cpu";
import * as tf from "@tensorflow/tfjs";

const outputLabelMap = {
    0: 1,
    1: 2,
    2: 3,
    3: "nothing",
  };

export default class MLLoader {
    constructor() {
      this.model = null;
    }

    loadModel = async (path) => {
        if (this.model) {
          return;
        } else {
          // this.model = options
          //   ? await tflite.loadTFLiteModel(path, options).catch((err) => {
          //       console.error("err-mlload", err);
          //     })
          //   : await tflite.loadTFLiteModel(path).catch((err) => {
          //       console.error("err-mlload", err);
          //     });
          this.model = await tf.loadLayersModel(path);
        }
    };

    runInference = async (inputElement) => {
        if (!this.model) {
          console.error("Model not loaded.");
          return;
        }
    
        const img = tf.browser.fromPixels(inputElement);
        // .mean(2)
        // .toFloat()
        // .expandDims(0)
        // .expandDims(-1);
        const processed = tf.image.resizeBilinear(img, [224, 224]);
        const input = tf.expandDims(processed);
    
        // console.log("processed", processed, img);
    
        let outputTensor = this.model.predict(input);
        const index = outputTensor.as1D().argMax().dataSync()[0];
        // const predict = outputTensor.dataSync();
        // console.log("predict", predict);
        // const value = predict[index];
        // console.log("ml", index, predict, value);
        return outputLabelMap[index];
      };
    }

    
