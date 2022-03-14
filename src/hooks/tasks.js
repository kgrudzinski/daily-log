import { useQuery, useQueryClient, useMutation } from "react-query";
import { TasksService } from "../services";

export function useTasks() {
  const tasks = useQuery(["tasks"], TasksService.get, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return tasks;
}

export function useTaskMutations(onSuccess, onError) {
  const queryClient = useQueryClient();

  const on_success = () => {
    queryClient.invalidateQery(["tasks"]);
    onSuccess();
  };

  const on_error = (error) => {
    onError(error);
  };

  const add_mut = useMutation(TasksService.add, {
    onSuccess: on_success,
    onError: on_error,
  });
  const update_mut = useMutation(TasksService.update, {
    onSuccess: on_success,
    onError: on_error,
  });
  const delete_mut = useMutation(TasksService.delete, {
    onSuccess: on_success,
    onError: on_error,
  });
  return { add: add_mut, update: update_mut, delete: delete_mut };
}
