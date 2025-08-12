import React, { useRef, useState } from "react";
import { ComponentProps, ComponentUpdateProps } from "../types";

type DragResizeState = {
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  isResizing: boolean;
  resizeStartX: number;
  resizeStartY: number;
  initialWidth: number;
  initialHeight: number;
  initialLeft: number;
  initialTop: number;
};

function getInt(value: any, defaultValue: number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const intVal = parseInt(value.replace(/[^\d]/g, ''), 10);
    return isNaN(intVal) ? defaultValue : intVal;
  }
  return defaultValue;
}

// Util: Clamp between min and max
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

export default function Section(props: ComponentProps & ComponentUpdateProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);

// eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (sectionRef.current) {
      parentRef.current = sectionRef.current.parentElement as HTMLElement;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State for position and size in px
  const [position, setPosition] = useState({
    left: getInt(props.styles.left, 0),
    top: getInt(props.styles.top, 0)
  });
  const [size, setSize] = useState({
    width: getInt(props.styles.width, 400),
    height: getInt(props.styles.height, 200)
  });

  const [dragResize, setDragResize] = useState<DragResizeState>({
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    isResizing: false,
    resizeStartX: 0,
    resizeStartY: 0,
    initialWidth: size.width,
    initialHeight: size.height,
    initialLeft: position.left,
    initialTop: position.top
  });

  // Helper to get parent dimensions for percent calcs
  const getParentDimensions = () => {
    if (!sectionRef.current?.parentElement) {
      return { width: 1, height: 1 }; // fallback
    }
    const parent = sectionRef.current.parentElement as HTMLElement;
    const rect = parent.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  };

  // Mouse move/drag/resize handlers
  React.useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (dragResize.isDragging) {
        const dx = e.clientX - dragResize.dragStartX;
        const dy = e.clientY - dragResize.dragStartY;
        setPosition({
          left: dragResize.initialLeft + dx,
          top: dragResize.initialTop + dy
        });
      }
      if (dragResize.isResizing) {
        const dw = e.clientX - dragResize.resizeStartX;
        const dh = e.clientY - dragResize.resizeStartY;
        setSize({
          width: Math.max(100, dragResize.initialWidth + dw),
          height: Math.max(50, dragResize.initialHeight + dh)
        });
      }
    }

    function handleMouseUp() {
      // On completion, commit relative style update to parent
      if ((dragResize.isDragging || dragResize.isResizing)) {
        const parentDims = getParentDimensions();
        const leftPct = clamp((position.left / parentDims.width) * 100, 0, 100);
        const topPct = clamp((position.top / parentDims.height) * 100, 0, 100);
        const widthPct = clamp((size.width / parentDims.width) * 100, 1, 100);
        const heightPct = clamp((size.height / parentDims.height) * 100, 1, 100);

        /*props.onUpdateStyles({
          left: `${leftPct}%`,
          top: `${topPct}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`
          // ...include other styles from props.styles if needed
        }, props.sequenceId);*/
      }
      setDragResize((s) => ({
        ...s,
        isDragging: false,
        isResizing: false
      }));
    }

    if (dragResize.isDragging || dragResize.isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragResize, position, size]); // track position and size for mouse up

  // Drag start
  function onDragStart(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    props.onSelectForEdit?.(props.sequenceId);
    setDragResize((state) => ({
      ...state,
      isDragging: true,
      dragStartX: e.clientX,
      dragStartY: e.clientY,
      initialLeft: position.left,
      initialTop: position.top
    }));
  }

  // Resize start (handle at bottom right corner)
  function onResizeStart(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    props.onSelectForEdit?.(props.sequenceId);
    setDragResize((state) => ({
      ...state,
      isResizing: true,
      resizeStartX: e.clientX,
      resizeStartY: e.clientY,
      initialWidth: size.width,
      initialHeight: size.height
    }));
  }

  // Compose style for the section (merge with passed props.styles, but locally track px during edit)
  const sectionStyle: React.CSSProperties = {
    ...props.styles,
    position: "absolute",
    left: position.left,
    top: position.top,
    width: size.width,
    height: size.height,
    boxSizing: "border-box",
    border: "2px solid #aaa",
    background: "#fff",
    userSelect: "none",
    cursor: dragResize.isDragging
      ? "grabbing"
      : "move"
  };

  const resizeHandleStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    background: "#ccc",
    borderRadius: 4,
    cursor: "nwse-resize",
    zIndex: 10
  };

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      onClick={(e) => {
        props.onSelectForEdit?.(props.sequenceId);
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseDown={e => props.isEditing && onDragStart(e)}
    >
      {props.children}
      {props.isEditing && (
        <div
          style={resizeHandleStyle}
          onMouseDown={onResizeStart}
          role="button"
          aria-label="Resize"
        />
      )}
    </section>
  );
}