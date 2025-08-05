import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiClient from "../../api/apiClient";
import { Auth, setPages, signIn, signOut } from "./authSlice";

export interface SignMessageData {
  username: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation<Auth, Error, SignMessageData>({
    mutationFn: async (data) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      dispatch(signIn(data));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      return;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth"] });
      dispatch(signOut());
    },
  });
};

export const useGetPages = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<any, Error, void>({
    mutationFn: async (data) => {
      const response = await apiClient.get("/pages/me");
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      dispatch(setPages(data));
    },
  });
};
