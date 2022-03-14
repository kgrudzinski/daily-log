import { useQuery, useQueryClient, useMutation } from "react-query";
import { ProjectsService } from "../services";

export function useProjects() {
  const projects = useQuery(["projects"], ProjectsService.get, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return projects;
}

export function useProjectMutations(onSuccess, onError) {
  const queryClient = useQueryClient();

  const on_success = () => {
    queryClient.invalidateQery(["projects"]);
    onSuccess();
  };

  const on_error = (error) => {
    onError(error);
  };

  const add_mut = useMutation(ProjectsService.add, {
    onSuccess: on_success,
    onError: on_error,
  });
  const update_mut = useMutation(ProjectsService.update, {
    onSuccess: on_success,
    onError: on_error,
  });
  const delete_mut = useMutation(ProjectsService.delete, {
    onSuccess: on_success,
    onError: on_error,
  });
  return { add: add_mut, update: update_mut, delete: delete_mut };
}
