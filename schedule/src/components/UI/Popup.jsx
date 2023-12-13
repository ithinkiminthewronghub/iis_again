// Popup.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Popup.module.css";

const Popup = ({ text, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return visible ? (
    <div
      className={`${styles.popup} ${
        type === "good" ? styles.popupGood : styles.popupBad
      }`}
    >
      <p>{text}</p>
    </div>
  ) : null;
};

Popup.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["good", "bad"]).isRequired,
};

export default Popup;
