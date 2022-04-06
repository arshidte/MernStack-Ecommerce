import React from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = (props) => {
  return (
    props.alert && (
      <Alert
        style={{
          position: "fixed",
          zIndex: 1,
          top: '2.25rem',
          right: '2.25rem',
          width: "300px",
          border: "2px solid #73AD21",
        }}
        variant={props.alert.type}
      >
        <p className="mb-0">{props.alert.message}</p>
      </Alert>
    )
  );
};

export default AlertMessage;
