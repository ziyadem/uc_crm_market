import React from "react"

const Toggle = ({ isOn, handleToggle }) => {
  return (
    <>
        <label class="switch">
            <input type="checkbox" />
            <span class="slider round"></span>
        </label>
    </>
  );
};

export default Toggle;
