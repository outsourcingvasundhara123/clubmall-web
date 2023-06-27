import React from 'react'
import loader from "../assets/img/loader.json"
import { Player } from '@lottiefiles/react-lottie-player';

const LoaderMain = (props) => {
    return (
        <div>
            <div className="loading d-flex justify-content-center align-items-center">
                <Player
                    onEvent={(event) => {
                        if (event === "load") props.startAnimationMain();
                        if (event === "complete") props.stopAnimationMain();
                    }}
                    ref={props.player}
                    controls={true}
                    src={loader}
                    loop
                    style={{ height: "100%", width: "100%" }}
                    background="transparent"
                ></Player>
            </div>
        </div>
    )
}

export default LoaderMain
