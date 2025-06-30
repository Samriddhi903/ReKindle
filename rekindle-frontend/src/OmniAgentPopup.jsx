import { useEffect, useState } from "react";
import helloImg from "./assets/hello.png";

export default function OmniAgentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Function to find the omnidimensional box and button
    const findOmniElements = () => {
      // Adjust selectors based on actual DOM structure of the external widget
      const omniBox = document.querySelector("#omnidimension-web-widget, .omnidimension-box, .omnidimensional-box");
      const omniButton = document.querySelector("#omnidimension-web-widget button, .omnidimension-button, .omnidimensional-button");

      if (omniButton && omniBox) {
        // Attach click listener to the button
        omniButton.addEventListener("click", () => {
          // Get bounding rect of the omnidimensional box
          const rect = omniBox.getBoundingClientRect();
          // Position popup above the box, centered horizontally
          setPopupStyle({
            position: "fixed",
            top: rect.top - 120 + window.scrollY, // 120px above the box
            left: rect.left + rect.width / 2 - 75 + window.scrollX, // center horizontally, assuming 150px width
            zIndex: 10000,
            width: 150,
            height: 150,
            pointerEvents: "auto"
          });
          setShowPopup(true);
          // Hide popup after 3 seconds
          setTimeout(() => setShowPopup(false), 3000);
        });
      }
    };

    // Try to find elements every 1 second until found
    const intervalId = setInterval(() => {
      findOmniElements();
    }, 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  if (!showPopup) return null;

  return (
    <img
      src={helloImg}
      alt="Hello Popup"
      style={popupStyle}
      draggable={false}
      className="rounded-lg shadow-lg"
    />
  );
}
