import React from "react";
const Alert = React.forwardRef((props, ref) => {
  return <div className="alert" ref={ref}></div>;
});
export default Alert;
