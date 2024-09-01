import {
  ProductErrorCodes,
  ProductHttpStatusCodes,
  ProductErrorMessages,
  CartErrorCodes,
  CartHttpStatusCodes,
  CartErrorMessages,
} from "../config/errorConfig.js";

function getErrorDetails(code, origin) {
  let ErrorCodes, HttpStatusCodes, ErrorMessages;

  if (origin === "product") {
    ErrorCodes = ProductErrorCodes;
    HttpStatusCodes = ProductHttpStatusCodes;
    ErrorMessages = ProductErrorMessages;
  } else if (origin === "cart") {
    ErrorCodes = CartErrorCodes;
    HttpStatusCodes = CartHttpStatusCodes;
    ErrorMessages = CartErrorMessages;
  } else {
    return {
      errorName: "UNKNOWN_ERROR",
      httpCode: 500,
      message: "An unknown error occurred",
    };
  }

  for (const [key, value] of Object.entries(ErrorCodes)) {
    if (value === code) {
      const httpCode = HttpStatusCodes[key] || 500;
      const message = ErrorMessages[key] || "An unknown error occurred";
      return { errorName: key, httpCode, message };
    }
  }

  return {
    errorName: "UNKNOWN_ERROR",
    httpCode: 500,
    message: "An unknown error occurred",
  };
}

export default getErrorDetails;
