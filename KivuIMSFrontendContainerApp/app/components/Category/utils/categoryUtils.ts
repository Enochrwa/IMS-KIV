import { Category, CategoryNode } from "../types/categoryTypes";

export const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
  const map = new Map<string, CategoryNode>();

  // Initialize all categories with empty children arrays
  categories.forEach((c) => map.set(c.id, { ...c, children: [] }));

  const roots: CategoryNode[] = [];

  // Connect parent → child
  map.forEach((cat) => {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(cat);
    } else {
      roots.push(cat);
    }
  });

  return roots;
};
