// Centralized async wrapper to catch unhandled promise rejections in controllers
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
