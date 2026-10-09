export const sendResponse = (res, statusCode, data = {}, message = "", isSuccess = true) => {

  return res.status(statusCode).json({
    
    data,
    message,
    isSuccess
  });
};