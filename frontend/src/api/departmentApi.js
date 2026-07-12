import api from "./client";

export const getDepartments = async () => {
  const res = await api.get("/departments");
  return res.data.data;
};

export const createDepartment = async (department) => {
  const res = await api.post("/departments", department);
  return res.data.data;
};

export const updateDepartment = async (id, department) => {
  const res = await api.put(`/departments/${id}`, department);
  return res.data.data;
};

export const deleteDepartment = async (id) => {
  const res = await api.delete(`/departments/${id}`);
  return res.data;
};