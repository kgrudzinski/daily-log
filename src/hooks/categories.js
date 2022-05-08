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

export function useCategoryMutations(onSuccess, onError) {
  const queryClient = useQueryClient();

  const on_success = () => {
    queryClient.invalidateQueries(["categories"]);
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
  const remove_mut = useMutation(CategoriesService.remove, {
    onSuccess: on_success,
    onError: on_error,
  });
  return {
    add: (value) => {
      add_mut.mutate({ id: 0, name: value });
    },
    update: (id, value) => {
      update_mut.mutate({ id: id, name: value });
    },
    remove: (id) => {
      remove_mut.mutate(id);
    },
  };
}
