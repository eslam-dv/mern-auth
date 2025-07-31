import { z } from "zod";

import SessionModel from "../models/session.model";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";

const getSessionsHandler = catchErrors(async (req, res) => {
  const session = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    { _id: 1, userAgent: 1, createdAt: 1 },
    { sort: { createdAt: -1 } },
  );

  res.status(200).json(
    session.map((session) => ({
      ...session.toObject(),
      ...(session._id == req.sessionId && {
        isCurrent: true,
      }),
    })),
  );
});

const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);

  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, 404, "Session not found");

  res.status(200).json({ message: "Session removed" });
});

export { getSessionsHandler, deleteSessionHandler };
