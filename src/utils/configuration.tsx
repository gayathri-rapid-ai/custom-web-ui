/**
 * Moves a child up or down in a deeply nested ComponentRenderProps/ComponentProps tree.
 * Returns a new root object and the updated child at its new location.
 */
import { ComponentRenderProps, ComponentProps } from "../types";

/**
 * Immutably reorder a child given a root, a sequence path, and a direction.
 * @param root The root component (page)
 * @param sequenceIds array of indices to traverse into children
 * @param direction "up" or "down"
 * @returns { newRoot, newSeq, newSelected } - 
 *   newRoot: the updated root after move,
 *   newSeq: the new sequence ID string for the moved item,
 *   newSelected: the moved ComponentProps
 */
export function reorderChildImmutable(
  root: ComponentRenderProps, 
  sequenceIds: number[], 
  direction: "up" | "down"
): { newRoot: ComponentRenderProps, newSeq: string, newSelected: ComponentProps | undefined } {
  if (sequenceIds.length === 0) return { newRoot: root, newSeq: "", newSelected: undefined };

  // Helper to deeply clone an object, only replacing what is changed
  function cloneWithMove(
    node: ComponentRenderProps,
    ids: number[]
  ): [ComponentRenderProps, ComponentProps | undefined, string] {
    if (ids.length === 1 && node.childs) {
      const idx = ids[0];
      if (idx < 0 || idx >= node.childs.length) return [node, undefined, ""];
      // Prepare copy
      const nextChilds = [...node.childs];
      const swapIdx =
        direction === "up"
          ? Math.max(0, idx - 1)
          : Math.min(nextChilds.length - 1, idx + 1);
      if (swapIdx === idx) return [node, nextChilds[idx], ids.join("$") + "$"]; // No move

      // Move
      [nextChilds[idx], nextChilds[swapIdx]] = [nextChilds[swapIdx], nextChilds[idx]];

      const moved = nextChilds[swapIdx];
      // Return new parent with updated children
      return [
        { ...node, childs: nextChilds },
        moved,
        // Compute newSeq: replace last index in sequence with swapIdx
        (ids.slice(0, -1).map(String).join("$") +
          (ids.length > 1 ? "$" : "") +
          swapIdx +
          "$")
      ];
    } else if (ids.length > 1 && node.childs) {
      const childIdx = ids[0];
      const [updatedChild, moved, seq] = cloneWithMove(
        node.childs[childIdx],
        ids.slice(1)
      );
      // Update only the traversed branch
      const nextChilds = [...node.childs];
      nextChilds[childIdx] = updatedChild as ComponentProps;
      return [
        { ...node, childs: nextChilds },
        moved,
        seq
      ];
    }
    return [node, undefined, ""];
  }

  const [newRoot, newSelected, newSeq] = cloneWithMove(root, sequenceIds);
  return { newRoot, newSeq, newSelected };
}