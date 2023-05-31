import React from 'react'
import loader from "../assets/img/loader.json"
import { Player } from '@lottiefiles/react-lottie-player';

const Loader = (props) => {

    return (
        <div>
            <div className="loading d-flex justify-content-center align-items-center">
                <Player
                    onEvent={(event) => {
                        if (event === "load") props.startAnimation();
                        if (event === "complete") props.stopAnimation();
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

export default Loader
