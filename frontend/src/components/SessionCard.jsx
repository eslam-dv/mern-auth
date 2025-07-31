import { Stack, Box, Typography, Button } from "@mui/material";
import useDeleteSession from "../hooks/useDeleteSession";
import { Delete } from "@mui/icons-material";

const SessionCard = ({ session }) => {
  const { _id, createdAt, userAgent, isCurrent } = session;

  const { removeSession, isPending } = useDeleteSession(_id);

  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        border: "1px solid #777",
        borderRadius: 3,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: "bold" }}>
          {new Date(createdAt).toLocaleString("en-UK")}{" "}
          {isCurrent && "{current session}"}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>{userAgent}</Typography>
      </Box>
      {!isCurrent && (
        <Button loading={isPending} onClick={removeSession}>
          <Delete color="error" />
        </Button>
      )}
    </Stack>
  );
};

export default SessionCard;
