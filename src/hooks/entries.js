import { useQuery, useQueryClient, useMutation } from "react-query";
import { EntriesService } from "../services";

export function useEntries() {
  const entries = useQuery(["entries"], EntriesService.get, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return entries;
}

export function useEntryMutations(onSuccess, onError) {
  const queryClient = useQueryClient();

  const on_success = () => {
    queryClient.invalidateQery(["Entries"]);
    onSuccess();
  };

  const on_error = (error) => {
    onError(error);
  };

  const add_mut = useMutation(EntriesService.add, {
    onSuccess: on_success,
    onError: on_error,
  });
  const update_mut = useMutation(EntriesService.update, {
    onSuccess: on_success,
    onError: on_error,
  });
  const delete_mut = useMutation(EntriesService.delete, {
    onSuccess: on_success,
    onError: on_error,
  });
  return { add: add_mut, update: update_mut, delete: delete_mut };
}
