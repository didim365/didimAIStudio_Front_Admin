"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Check,
  File,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useGetGroups } from "../_hooks/useGetGroups";
import { Skeleton } from "@/shared/ui/skeleton";
import { paths } from "@/shared/types/api/auth";

type Group =
  paths["/api/v1/groups"]["get"]["responses"]["200"]["content"]["application/json"]["items"][0];

interface GroupTreeNode extends Group {
  children: GroupTreeNode[];
  level: number;
}

interface GroupTreeViewProps {
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  multiSelect?: boolean;
  excludeIds?: number[]; // IDs to exclude from the tree (e.g. self and children when editing)
  className?: string;
}

export default function GroupTreeView({
  selectedIds,
  onSelect,
  multiSelect = false,
  excludeIds = [],
  className,
}: GroupTreeViewProps) {
  // Fetch all groups (large size to get all)
  const { data: groupsData, isLoading } = useGetGroups({
    page: 1,
    page_size: 100,
  });

  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // Build tree
  let tree: GroupTreeNode[] = [];
  const nodes: Record<number, GroupTreeNode> = {};
  const roots: GroupTreeNode[] = [];

  // First pass: create ALL nodes
  groupsData?.items?.forEach((group:any) => {
    nodes[group.id] = {
      ...group,
      children: [],
      level: 0,
    };
  });

  // Second pass: build hierarchy
  groupsData?.items?.forEach((group:any) => {
    const node = nodes[group.id];
    if (node.parent_group_id && nodes[node.parent_group_id]) {
      nodes[node.parent_group_id].children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Filter out excluded nodes and their descendants
  // If a node is excluded, it and its children are removed from the tree structure being returned
  const filterNodes = (nodes: GroupTreeNode[]): GroupTreeNode[] => {
    return nodes
      .filter((node) => !excludeIds.includes(node.id))
      .map((node) => ({
        ...node,
        children: filterNodes(node.children),
      }));
  };

  const filteredRoots = filterNodes(roots);

  // Recursive function to set levels
  const setLevels = (nodes: GroupTreeNode[], level: number) => {
    nodes.forEach((node) => {
      node.level = level;
      if (node.children.length > 0) {
        setLevels(node.children, level + 1);
      }
    });
  };
  setLevels(filteredRoots, 0);

  tree = filteredRoots;

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelect = (id: number) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onSelect(selectedIds.filter((i) => i !== id));
      } else {
        onSelect([...selectedIds, id]);
      }
    } else {
      onSelect([id]);
    }
  };

  const renderNode = (node: GroupTreeNode) => {
    const isExpanded = expandedIds.includes(node.id);
    const isSelected = selectedIds.includes(node.id);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors group",
            isSelected && "bg-accent"
          )}
          style={{ paddingLeft: `${node.level * 20 + 8}px` }}
          onClick={() => handleSelect(node.id)}
        >
          <div
            className={cn(
              "p-0.5 rounded-sm hover:bg-muted mr-1 transition-colors cursor-pointer",
              !hasChildren && "opacity-0 pointer-events-none"
            )}
            onClick={(e) => hasChildren && toggleExpand(node.id, e)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 mr-2 text-primary shrink-0" />
            ) : (
              <Folder className="h-4 w-4 mr-2 text-primary shrink-0" />
            )
          ) : (
            <File className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
          )}

          <span
            className={cn(
              "flex-1 text-sm truncate select-none",
              isSelected && "font-medium"
            )}
          >
            {node.group_name}
          </span>

          {isSelected && (
            <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>{node.children.map((child) => renderNode(child))}</div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-8 text-center border border-dashed rounded-md">
        표시할 그룹이 없습니다.
      </div>
    );
  }

  return (
    <div className={cn("border rounded-md py-2 overflow-hidden", className)}>
      <div className="max-h-[400px] overflow-y-auto">
        {tree.map((root) => renderNode(root))}
      </div>
    </div>
  );
}
