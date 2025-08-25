import React, { useRef, useState, useEffect } from "react";
import { ComponentRenderProps, ComponentUpdateProps } from "../types";

// Minimum size in rems (numbers, not strings)
const MIN_WIDTH_REM = 6;
const MIN_HEIGHT_REM = 3;

// Helper to get root font size (for conversion)
function getRootFontSize(): number {
  if (typeof window !== "undefined") {
    const size = getComputedStyle(document.documentElement).fontSize;
    return parseFloat(size || "16");
  }
  return 16;
}

// Converts number rems to px
function remToPx(rem: number): number {
  return rem * getRootFontSize();
}

// Converts px to number rems
function pxToRem(px: number): number {
  return px / getRootFontSize();
}

// Parses value (number, string 'rem' or 'px') to number rems
function parseRem(val: unknown, fallback: number): number {
  if (typeof val === "number" && !isNaN(val)) return val;

  if (typeof val === "string") {
    const remMatch = val.match(/^([0-9.]+)\s*rem$/);
    if (remMatch) {
      const parsed = parseFloat(remMatch[1]);
      return isNaN(parsed) ? fallback : parsed;
    }
    const pxMatch = val.match(/^([0-9.]+)\s*px$/);
    if (pxMatch) {
      const parsedPx = parseFloat(pxMatch[1]);
      return isNaN(parsedPx) ? fallback : pxToRem(parsedPx);
    }
    // Plain string, try to parse as rem
    const asNumber = parseFloat(val);
    return isNaN(asNumber) ? fallback : asNumber;
  }

  return fallback;
}

/**
 * EditLayer - enables resizing by dragging the lower right corner, with rem sizing
 */
const EditLayer: React.FC<ComponentRenderProps & ComponentUpdateProps> = (props) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState<{
    widthRem: number;
    heightRem: number;
  }>({
    widthRem: parseRem(props.style?.minWidth, MIN_WIDTH_REM),
    heightRem: parseRem(props.style?.minHeight, MIN_HEIGHT_REM),
  });

  useEffect(() => {
    setDimensions({
      widthRem: parseRem(props.style?.minWidth, MIN_WIDTH_REM),
      heightRem: parseRem(props.style?.minHeight, MIN_HEIGHT_REM),
    });
  }, [props.style?.minWidth, props.style?.minHeight]);

  const startPos = useRef<{
    mouseX: number;
    mouseY: number;
    widthPx: number;
    heightPx: number;
  } | null>(null);

  // OnMouseDown: capture starting px position
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!layerRef.current) return;
    const rect = layerRef.current.getBoundingClientRect();
    const inResizeCorner =
      e.clientX >= rect.right - 16 &&
      e.clientX <= rect.right &&
      e.clientY >= rect.bottom - 16 &&
      e.clientY <= rect.bottom;
    if (!inResizeCorner) return;
    e.preventDefault();

    startPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      widthPx: rect.width,
      heightPx: rect.height,
    };
    setIsResizing(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // OnMouseMove: resize in px, then convert to rem
  const handleMouseMove = (e: MouseEvent) => {
    if (!startPos.current) return;
    const dx = e.clientX - startPos.current.mouseX;
    const dy = e.clientY - startPos.current.mouseY;
    let newWidthPx = Math.max(remToPx(MIN_WIDTH_REM), startPos.current.widthPx + dx);
    let newHeightPx = Math.max(remToPx(MIN_HEIGHT_REM), startPos.current.heightPx + dy);
    let newWidthRem = pxToRem(newWidthPx);
    let newHeightRem = pxToRem(newHeightPx);

    setDimensions({
      widthRem: newWidthRem,
      heightRem: newHeightRem,
    });

    // Call onEditStyles with correctly formatted rem strings (e.g. "6rem")
    props.onEditStyles({
      ...props.styles,
      minWidth: `${newWidthRem}rem`,
      minHeight: `${newHeightRem}rem`,
    });
  };

  // OnMouseUp: cleanup event listeners
  const handleMouseUp = () => {
    setIsResizing(false);
    startPos.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Cursor changes for resize corner
  const handleMouseMoveDiv = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!layerRef.current) return;
    const rect = layerRef.current.getBoundingClientRect();
    const inResizeCorner =
      e.clientX >= rect.right - 16 &&
      e.clientX <= rect.right &&
      e.clientY >= rect.bottom - 16 &&
      e.clientY <= rect.bottom;
    layerRef.current.style.cursor = inResizeCorner ? "nwse-resize" : "default";
  };

  // Styles: use rem unit strings for rendering
  const widthStr = `${dimensions.widthRem}rem`;
  const heightStr = `${dimensions.heightRem}rem`;
  const minWidthStr = `${MIN_WIDTH_REM}rem`;
  const minHeightStr = `${MIN_HEIGHT_REM}rem`;

  // Only enable resizing for section and div
  if(props.name !== "section" && props.name !== "div") {
    return (
      <>
        {props.children}
      </>
    );
  }

  // Controlled style cleanup:
  const outerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: widthStr,
    minWidth: minWidthStr,
    height: heightStr,
    minHeight: minHeightStr,
    // Allow content to overflow so resize handles are fully visible
    overflow: "visible",
    position: "relative"
  };

  const innerStyle: React.CSSProperties = {
    border: isResizing ? "2px dashed #6495ed" : "1px solid #d6d6d6",
    backgroundColor: isResizing ? "#e6f2ff" : "#f0f8ff",
    userSelect: isResizing ? "none" : undefined,
    transition: isResizing
      ? "none"
      : "border 0.18s, background-color 0.18s, box-shadow 0.18s",
    boxShadow: isResizing ? "0 0 6px #6495ed" : undefined,
    width: widthStr,
    minWidth: minWidthStr,
    height: heightStr,
    minHeight: minHeightStr,
    position: "relative",
  };

  // Draw a resize handle in the lower-right corner
  const handleSize = 16;
  const resizeHandleStyle: React.CSSProperties = {
    position: "absolute",
    width: handleSize,
    height: handleSize,
    bottom: 0,
    right: 0,
    background: "#6495ed",
    opacity: 0.8,
    borderRadius: "4px",
    cursor: "nwse-resize",
    zIndex: 10,
    display: isResizing ? "block" : "block", // always visible
    pointerEvents: "none",
  };

  return (
    <div style={outerStyle}>
      <div
        ref={layerRef}
        style={innerStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveDiv}
      >
        {props.children}
        {/* visual resize handle */}
        <div style={resizeHandleStyle} />
      </div>
    </div>
  );
};

export default EditLayer;