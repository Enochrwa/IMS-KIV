export const getProductListQuery = `
 mutation GetProductList($input: GetProductList!) {
      geProductList(input: $input) {
        id
    }
 }
`;

export const createProductQuery = `
 mutation CreateProduct($input: CreateProduct!) {
       createProduct(input: $input) {
        id
    }
 }
`;

export const getProductDetailQuery = `
 mutation GetProductDetail($input: GetProductDetail!) {
      geProductDetail(input: $input) {
        id
    }
 }
`;

export const updateProductQuery = `
 mutation UpdateProduct($input: UpdateProduct!) {
      updateProduct(input: $input) {
        id
    }
 }
`;
