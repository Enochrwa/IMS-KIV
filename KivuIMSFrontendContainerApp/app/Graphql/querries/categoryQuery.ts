export const getCategoryListQuery = `
  query GetCategories {
    getCategories {
      categoryList {
        id
        name
        description
        parentId
        path
        depth
        status
        companyId
        createdBy
        createdAt
        updatedBy
        updatedAt
      }
    }
  }
`;

export const getCategoryDetailQuery = `
  query GetCategoryDetail($input: GetCategoryDetailRequest!) {
    getCategoryDetail(input: $input) {
      category {
        id
        name
        description
        parentId
        path
        depth
        status
        companyId
        createdBy
        createdAt
        updatedBy
        updatedAt
      }
    }
  }
`;

export const createCategoryQuery = `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      category {
        id
        name
        description
        parentId
        path
        depth
        status
        companyId
        createdBy
        createdAt
      }
    }
  }
`;

export const updateCategoryQuery = `
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      category {
        id
        name
        description
        parentId
        path
        depth
        status
        updatedBy
        updatedAt
      }
    }
  }
`;

export const deleteCategoryQuery = `
  mutation DeleteCategory($input: DeleteCategoryRequest!) {
    deleteCategory(input: $input)
  }
`;
