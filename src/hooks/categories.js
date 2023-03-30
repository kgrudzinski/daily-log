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

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const on_success = () => {
    queryClient.invalidateQueries(["categories"]);
  };

  const add_mut = useMutation(CategoriesService.add, {
    onSuccess: on_success,
    //onError: on_error,
  });
  const update_mut = useMutation(CategoriesService.update, {
    onSuccess: on_success,
    //onError: on_error,
  });
  const remove_mut = useMutation(CategoriesService.remove, {
    onSuccess: on_success,
    //onError: on_error,
  });
  return {
    add: add_mut.mutate,
    update: update_mut.mutate,
    remove: remove_mut.mutate,
  };
}
