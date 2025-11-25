import { CATEGORY_STATUS } from "../../enums/categoryEnums";
import { Category } from "../../types/categoryTypes";
import { buildCategoryTree } from "../categoryUtils";

const baseCategory = {
  description: "",
  status: CATEGORY_STATUS.ACTIVE,
  companyId: "company-123",
  createdBy: "admin",
  createdAt: "2025-01-01T00:00:00Z"
};

describe("buildCategoryTree", () => {
  it("should build a single root tree with nested children", () => {
    const categories: Category[] = [
      {
        id: "1",
        name: "Electronics",
        parentId: null,
        depth: 0,
        ...baseCategory
      },
      { id: "2", name: "Phones", parentId: "1", depth: 1, ...baseCategory },
      {
        id: "3",
        name: "Smartphones",
        parentId: "2",
        depth: 2,
        ...baseCategory
      },
      {
        id: "4",
        name: "Android Phones",
        parentId: "3",
        depth: 3,
        ...baseCategory
      }
    ];

    const tree = buildCategoryTree(categories);

    expect(tree).toHaveLength(1); // Only 1 root: Electronics
    expect(tree[0].children).toHaveLength(1); // Phones
    expect(tree[0].children[0].children[0].name).toBe("Smartphones");
    expect(tree[0].children[0].children[0].children[0].name).toBe(
      "Android Phones"
    );
  });

  it("should handle multiple roots correctly", () => {
    const categories: Category[] = [
      {
        id: "1",
        name: "Electronics",
        parentId: null,
        depth: 0,
        ...baseCategory
      },
      { id: "2", name: "Furniture", parentId: null, depth: 0, ...baseCategory },
      { id: "3", name: "Phones", parentId: "1", depth: 1, ...baseCategory }
    ];

    const tree = buildCategoryTree(categories);

    expect(tree).toHaveLength(2); // Electronics and Furniture
    const electronics = tree.find((n) => n.name === "Electronics");
    const furniture = tree.find((n) => n.name === "Furniture");

    expect(electronics?.children).toHaveLength(1);
    expect(furniture?.children).toHaveLength(0);
  });

  it("should skip children with missing parents", () => {
    const categories: Category[] = [
      {
        id: "1",
        name: "Electronics",
        parentId: null,
        depth: 0,
        ...baseCategory
      },
      { id: "2", name: "Phones", parentId: "999", depth: 1, ...baseCategory } // invalid parent
    ];

    const tree = buildCategoryTree(categories);

    expect(tree).toHaveLength(2);
    expect(tree.find((n) => n.name === "Phones")?.parentId).toBe("999");
  });

  it("should add empty children array for leaf nodes", () => {
    const categories: Category[] = [
      {
        id: "1",
        name: "Electronics",
        parentId: null,
        depth: 0,
        ...baseCategory
      },
      { id: "2", name: "Phones", parentId: "1", depth: 1, ...baseCategory }
    ];

    const tree = buildCategoryTree(categories);

    const leaf = tree[0].children[0];
    expect(Array.isArray(leaf.children)).toBe(true);
    expect(leaf.children).toHaveLength(0);
  });

  it("should not mutate the original category list", () => {
    const categories: Category[] = [
      {
        id: "1",
        name: "Electronics",
        parentId: null,
        depth: 0,
        ...baseCategory
      },
      { id: "2", name: "Phones", parentId: "1", depth: 1, ...baseCategory }
    ];

    const original = JSON.parse(JSON.stringify(categories));
    buildCategoryTree(categories);

    expect(categories).toEqual(original); // immutable behavior
  });
});
