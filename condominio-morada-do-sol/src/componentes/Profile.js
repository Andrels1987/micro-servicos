import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 150,
  height: 150,
  facingMode: "environment",
};

const Profile = ({ setData, data }) => {
  const [isLigada, setIsLigada] = useState(false);
  const webcamRef = React.useRef(null);

  useEffect(() => {
    if(data.foto === ""){
      setIsLigada(false)
    }
  }, [data.foto])
  
    
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();        
    setData(old => {
      return  {...data, foto:pictureSrc}
    });
  }, [data, setData]); 
 
  
  return (
    <div className="picture">
      <div>
        {!isLigada ? (
          <img src={data.foto || "../../logo192.png"} alt="logo" />
        ) : 
        data.foto === "" ? (
          <Webcam
            className="webcam"
            audio={false}
            height={200}
            ref={webcamRef}
            width={200}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={data.foto || ""} alt="face" />
        )}
      </div>

      <div>
        {data.foto !== "" ? (
          <button
            onClick={() => {
              setData(old => {
                return {...data, foto: ""}});
              setIsLigada(true);
            }}
            className="btn btn-primary"
          >
            Tentar novamente
          </button>
        ) : (
          <div className="btn_capturar">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLigada(!isLigada);
              }}
              className="btn btn-success"
            >
              {isLigada ? "Desligar Camera" : "Ligar Camera"}
            </button>
            <button
              disabled={!isLigada}
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
              className="btn btn-primary"
            >
              Tirar foto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
