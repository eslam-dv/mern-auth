import API from "../config/apiClient";

const login = async (data) => await API.post("/auth/login", data);

const logout = async () => await API.get("/auth/logout");

const register = async (data) => await API.post("/auth/register", data);

const verifyEmail = async (verificationCode) =>
  await API.get(`/auth/email/verify/${verificationCode}`);

const sendPasswordResetEmail = async (email) =>
  await API.post("/auth/password/forgot", { email });

const resetPassword = async ({ password, verificationCode }) =>
  await API.post("/auth/password/reset", { password, verificationCode });

const getUser = async () => await API.get("/user");

const getSessions = async () => await API.get("/session");

const deleteSession = async (sessionId) =>
  await API.delete(`/session/${sessionId}`);

export {
  login,
  logout,
  register,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
  getUser,
  getSessions,
  deleteSession,
};
