import API from "../../../Redux/API";

// Register new complaint
export const registerComplaint = async (complaintData) => {
  try {
    const response = await API.post("/complaints/register", complaintData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Network error" };
  }
};

// Track complaint by ID
export const trackComplaintById = async (complaintId) => {
  try {
    const response = await API.get(`/complaints/track/${complaintId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Network error" };
  }
};

// Get all complaints for a user
export const getUserComplaints = async (userId, params = {}) => {
  try {
    const response = await API.get(`/complaints/user/${userId}`, {
      params: params, // { page, limit, status }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Network error" };
  }
};

// Update complaint status (Admin)
export const updateComplaintStatus = async (complaintId, updateData) => {
  try {
    const response = await API.put(
      `/complaints/update/${complaintId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Network error" };
  }
};
