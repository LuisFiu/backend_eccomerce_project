const ProductErrorCodes = {
  PRODUCT_CREATION_FAILED: -1,
  PRODUCT_NOT_FOUND: -2,
  PRODUCT_LIST_EMPTY: -3,
};

const ProductHttpStatusCodes = {
  PRODUCT_CREATION_FAILED: 500,
  PRODUCT_NOT_FOUND: 404,
  PRODUCT_LIST_EMPTY: 404,
};

const ProductErrorMessages = {
  PRODUCT_CREATION_FAILED: "Error during create product",
  PRODUCT_NOT_FOUND: "Product doesn't exist",
  PRODUCT_LIST_EMPTY: "Product list is empty, try creating a product first",
};

const CartErrorCodes = {
  CART_CREATION_FAILED: -1,
  CART_NOT_FOUND: -2,
  PRODUCT_NOT_FOUND: -3,
  CART_LIST_EMPTY: -4,
  PRODUCT_NOT_FOUND_ON_CART: -5,
};

const CartHttpStatusCodes = {
  CART_CREATION_FAILED: 500,
  CART_NOT_FOUND: 404,
  PRODUCT_NOT_FOUND: 404,
  CART_LIST_EMPTY: 404,
  PRODUCT_NOT_FOUND_ON_CART: 404,
};

const CartErrorMessages = {
  CART_CREATION_FAILED: "Couldn't create cart",
  CART_NOT_FOUND: "Cart doesn't exist",
  PRODUCT_NOT_FOUND: "Product doesn't exist",
  CART_LIST_EMPTY: "Carts list is empty, try creating a cart first",
  PRODUCT_NOT_FOUND_ON_CART: "Product doesn't exist already in cart",
};

export {
  ProductErrorCodes,
  ProductHttpStatusCodes,
  ProductErrorMessages,
  CartErrorCodes,
  CartHttpStatusCodes,
  CartErrorMessages,
};
