import React from "react";

export default function Content(props) {
  const warp = {
    paddingTop: '66px'
  }
  return (
    <div style={warp}>
      {props.children}
    </div>
  );
}
