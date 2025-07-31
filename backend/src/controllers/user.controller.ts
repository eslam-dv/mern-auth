import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, 404, "User not found");

  res.status(200).json({ user: user.omitPassword() });
});

export { getUserHandler };
