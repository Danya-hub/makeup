import React from "react";
import types from "prop-types";

import style from "./PlaceholderLoader.module.css";

BackgroundLoader.propTypes = {
    widthInPx: types.string,
};

function BackgroundLoader({
    widthInPx = "0px",
}) {
  return (
    <div className={style.background} style={{
          "--w": widthInPx
    }}></div>
  )
}


export default BackgroundLoader
