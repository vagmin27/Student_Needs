export const success = (code, body) => {
  return {
    status: "success",
    statusCode: code,
    message: body,
  };
};

export const error = (code, body) => {
  return {
    status: "error",
    statusCode: code,
    message: body,
  };
};