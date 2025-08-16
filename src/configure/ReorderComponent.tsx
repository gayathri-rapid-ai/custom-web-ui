import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps } from "../types";

export interface ReorderListProps {
  items: ComponentProps[];
  onReorder: (newOrder: ComponentProps[]) => void;
  onSelectChild?: (childId: string) => void;
}

/**
 * Sortable row with drag handle and Traverse button.
 */
const SortableItem: React.FC<{
  item: ComponentProps;
  index: number;
  onSelectChild?: (childId: string) => void;
}> = ({ item, index, onSelectChild }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.sequenceId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    background: isDragging ? "#ffe082" : "#fff",
    border: "1px solid #ddd",
    borderRadius: 5,
    padding: 6,
    marginBottom: 6,
    gap: 8,
    boxShadow: isDragging ? "0 2px 8px #ffe08277" : "",
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Drag handle */}
      <span
        {...listeners}
        style={{
          cursor: "grab",
          marginRight: 10,
          padding: "2px 8px",
          background: "#fff8e1",
          border: "1px solid #aaa",
          borderRadius: 4,
          userSelect: "none",
          display: "inline-block",
        }}
        title="Drag to reorder"
        aria-label="Drag handle"
      >
        &#9776;
      </span>
      <span style={{ fontWeight: "bold", flex: 1 }}>{item.name}</span>
      <button
        style={{
          background: "#e0e0ff",
          border: "1px solid #aaa",
          borderRadius: 4,
          cursor: "pointer",
          padding: "4px 10px",
        }}
        title={`Traverse to "${item.name}"`}
        onClick={() => onSelectChild?.(item.sequenceId)}
      >
        Traverse
      </button>
    </div>
  );
};

/**
 * DND reorderable children list for children panel, with "Traverse" button.
 */
export const ReorderableList: React.FC<ReorderListProps> = ({
  items,
  onReorder,
  onSelectChild,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.sequenceId === active.id);
      const newIndex = items.findIndex((item) => item.sequenceId === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onReorder(newOrder);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.sequenceId)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item, idx) => (
            <SortableItem
              key={item.sequenceId}
              item={item}
              index={idx}
              onSelectChild={onSelectChild}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};