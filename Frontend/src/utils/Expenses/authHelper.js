export const getUserId = (user) => {
  return user?._id || user?.id || null;
};
