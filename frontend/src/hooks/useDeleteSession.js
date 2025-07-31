import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "../lib/api";
import { SESSIONS } from "./useSession";

const useDeleteSession = (sessionId) => {
  const queryClient = useQueryClient();
  const { mutate: removeSession, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (cache) =>
        cache.filter((session) => session._id !== sessionId),
      );
    },
  });
  return { removeSession, ...rest };
};

export default useDeleteSession;
