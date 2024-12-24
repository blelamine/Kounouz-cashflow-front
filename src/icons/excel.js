import React from "react";
import PropTypes from "prop-types";

const ExcelIcon = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M38 4H10C7.8 4 6 5.8 6 8v32c0 2.2 1.8 4 4 4h28c2.2 0 4-1.8 4-4V12L38 4zM24 36h-4v-8h-2l2-2-2-2h2v-8h4v8h2l-2 2 2 2h-2v8zm10 0h-8v-8h-8v8H8V12h32v24z" />
  </svg>
);

ExcelIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};

ExcelIcon.defaultProps = {
  size: 24,
  color: "green",
};

export default ExcelIcon;
