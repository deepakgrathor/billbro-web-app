// DisableInteractionWrapper.js
import { useEffect } from "react";

const DisableInteractionWrapper = ({ children }) => {
  useEffect(() => {
    // Disable right click / context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable copy, cut, paste globally
    const handleCopyCutPaste = (e) => e.preventDefault();
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
    };
  }, []);

  return (
    <div
      style={{
        userSelect: "none", // disable text selection
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none", // disable iOS long press menu
      }}
    >
      {children}
    </div>
  );
};

export default DisableInteractionWrapper;
