import { useQuery, useQueryClient, useMutation } from "react-query";
import { CategoriesService } from "../services";

export function useCategories() {
  const categories = useQuery(["categories"], CategoriesService.get, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return categories;
}

export function useTaskMutations(onSuccess, onError) {
  const queryClient = useQueryClient();

  const on_success = () => {
    queryClient.invalidateQery(["Categories"]);
    onSuccess();
  };

  const on_error = (error) => {
    onError(error);
  };

  const add_mut = useMutation(CategoriesService.add, {
    onSuccess: on_success,
    onError: on_error,
  });
  const update_mut = useMutation(CategoriesService.update, {
    onSuccess: on_success,
    onError: on_error,
  });
  const delete_mut = useMutation(CategoriesService.delete, {
    onSuccess: on_success,
    onError: on_error,
  });
  return { add: add_mut, update: update_mut, delete: delete_mut };
}
