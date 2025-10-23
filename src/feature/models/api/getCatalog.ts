import axiosInstance from "@/shared/utils/axiosInstance";

const getCatalog = async () => {
  try {
    const response = await axiosInstance.models.get("/catalog");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCatalog;
