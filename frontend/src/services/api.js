import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const patientAPI = {
  getDashboard: () => api.get("/patient/dashboard"),
  getAppointments: () => api.get("/patient/appointments"),
  bookAppointment: (data) => api.post("/patient/book-appointment", data),
  cancelAppointment: (id) => api.put(`/patient/appointments/cancel/${id}`),
  getProfile: () => api.get("/patient/profile"),
  updateProfile: (data) => api.put("/patient/profile", data),
  getDoctors: () => api.get("/patient/doctors"),
};

export const doctorAPI = {
  getDashboard: () => api.get("/doctor/dashboard"),
  getAppointments: () => api.get("/doctor/appointments"),
  confirmAppointment: (id) => api.put(`/doctor/appointments/confirm/${id}`),
  cancelAppointment: (id) => api.put(`/doctor/appointments/cancel/${id}`),
  getProfile: () => api.get("/doctor/profile"),
  updateProfile: (data) => api.put("/doctor/profile", data),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAllDoctors: () => api.get("/admin/doctors"),
  addDoctor: (data) => api.post("/admin/doctors/add", data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/delete/${id}`),
  updateDoctor: (id, data) => api.put(`/admin/doctors/update/${id}`, data),
  updatePatient: (id, data) => api.put(`/admin/patients/update/${id}`, data),
  getAllPatients: () => api.get("/admin/patients"),
  getAllAppointments: () => api.get("/admin/appointments"),
};

export default api;
