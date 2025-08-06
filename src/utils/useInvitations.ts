import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/apiClient";
import { toaster } from "@/components/ui/toaster";

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = useCallback(async (type?: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get("/pages/me", {
        params: type ? { type } : undefined,
      });
      setInvitations(response.data.data || []);
    } catch (error) {
      toaster.create({
        title: "Lỗi khi tải thiệp cưới",
        description:
          "Không thể tải danh sách thiệp cưới. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return {
    invitations,
    loading,
    setLoading,
    refetch: fetchInvitations,
  };
};
