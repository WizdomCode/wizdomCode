import React from "react";

const SideDesign = ({ side }) => {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0", // Example background color
        width: "200px", // Example width
        height: "100%", // Fill the entire height of the screen
        position: "fixed",
        top: 0,
        [side]: 0, // Position on the left or right side
      }}
    >
      {/* Add content or design elements here */}
    </div>
  );
};

export default SideDesign;
