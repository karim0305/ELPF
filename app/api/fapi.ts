import axios from 'axios';

// Backend API Base URL
//  const baseUrl = 'https://elpb.vercel.app/elpapi';
const baseUrl = 'http://localhost:3010/elpapi';

// Log API calls in development
if (typeof window !== 'undefined') {
  axios.interceptors.request.use((config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  }, (error) => {
    console.error(`❌ API Request Error:`, error);
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  }, (error) => {
    console.error(`❌ API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  });
}

/* ===================== AUTH ===================== */
export const login = (data: any) =>
  axios.post(`${baseUrl}/auth/login`, data);

export const forgotPasswordSendOtp = (data: any) =>
  axios.post(`${baseUrl}/auth/forgot/send-otp`, data);

export const forgotPasswordVerifyOtp = (data: any) =>
  axios.post(`${baseUrl}/auth/forgot/verify-otp`, data);

export const forgotPasswordReset = (data: any) =>
  axios.post(`${baseUrl}/auth/forgot/reset`, data);

/* ===================== USERS ===================== */
export const addUser = (data: any) =>
  axios.post(`${baseUrl}/users`, data);

export const getUsers = () =>
  axios.get(`${baseUrl}/users`);

export const getUserById = (id: string) =>
  axios.get(`${baseUrl}/users/${id}`);

export const updateUser = (id: string, data: any) =>
  axios.put(`${baseUrl}/users/${id}`, data);

export const deleteUser = (id: string) =>
  axios.delete(`${baseUrl}/users/${id}`);


/* ===================== Super Admin ===================== */
export const addSuperAdmin = (data: any) =>
  axios.post(`${baseUrl}/super-admin`, data);

export const getSuperAdmins = () =>
  axios.get(`${baseUrl}/super-admin`);

export const getSuperAdminById = (id: string) =>
  axios.get(`${baseUrl}/super-admin/${id}`);

export const updateSuperAdmin = (id: string, data: any) =>
  axios.put(`${baseUrl}/super-admin/${id}`, data);

export const deleteSuperAdmin = (id: string) =>
  axios.delete(`${baseUrl}/super-admin/${id}`);


/* ===================== DEVICE ===================== */
export const addDevice = (data: any) =>
  axios.post(`${baseUrl}/device`, data);

export const getAllDevices = () =>
  axios.get(`${baseUrl}/device`);

export const getDeviceByImei = (imei: string) =>
  axios.get(`${baseUrl}/device/imei/${imei}`);

export const updateDeviceByImei = (imei: string, data: any) =>
  axios.put(`${baseUrl}/device/imei/${imei}`, data);

export const deleteDeviceByImei = (imei: string) =>
  axios.delete(`${baseUrl}/device/imei/${imei}`);

/* ===================== MILL INFO ===================== */
export const addMillInfo = (data: any) =>
  axios.post(`${baseUrl}/millinfo`, data);

export const getMillInfos = () =>
  axios.get(`${baseUrl}/millinfo`);

export const getMillInfoById = (id: string) =>
  axios.get(`${baseUrl}/millinfo/${id}`);

export const updateMillInfo = (id: string, data: any) =>
  axios.put(`${baseUrl}/millinfo/${id}`, data);

export const deleteMillInfo = (id: string) =>
  axios.delete(`${baseUrl}/millinfo/${id}`);

/* ===================== ELP ===================== */
export const addElp = (data: any) => axios.post(`${baseUrl}/elp`, data);

/**
 * Get all ELPs OR filter by millId if provided
 * @param millId optional mill id to filter ELPs
 */
export const getElps = (millId?: string) => {
  if (millId) {
    return axios.get(`${baseUrl}/elp`, { params: { millid: millId } });
  }
  return axios.get(`${baseUrl}/elp`);
};

export const getElpById = (id: string) => axios.get(`${baseUrl}/elp/${id}`);

export const updateElp = (id: string, data: any) => axios.put(`${baseUrl}/elp/${id}`, data);

export const deleteElp = (id: string) => axios.delete(`${baseUrl}/elp/${id}`);

/* ===================== REGISTRATION ===================== */
export const addRegistration = (data: any) =>
  axios.post(`${baseUrl}/registration`, data);

export const getRegistrationsByMill = (
  millid: string,
  deviceId: string,
) =>
  axios.get(
    `${baseUrl}/registration/by-mill/${millid}?deviceId=${deviceId}`,
  );


  export const getRegForArrival = (
  millid: string,
) =>
  axios.get(
    `${baseUrl}/registration/by-mill/${millid}`,
  );


export const getRegistrations = () =>
  axios.get(`${baseUrl}/registration`);

export const getRegistrationById = (id: string) =>
  axios.get(`${baseUrl}/registration/${id}`);

export const updateRegistration = (id: string, data: any) =>
  axios.put(`${baseUrl}/registration/${id}`, data);

export const deleteRegistration = (id: string) =>
  axios.delete(`${baseUrl}/registration/${id}`);

/* ===================== ARRIVAL ===================== */
export const addArrival = (data: any) =>
  axios.post(`${baseUrl}/arrival`, data);
 
export const getArrivals = () =>
  axios.get(`${baseUrl}/arrival`);

export const getArrivalById = (id: string) =>
  axios.get(`${baseUrl}/arrival/${id}`);

export const updateArrivalStatus = (id: string, status: string) =>
  axios.put(`${baseUrl}/arrival/${id}/status`, { status });

export const deleteArrival = (id: string) =>
  axios.delete(`${baseUrl}/arrival/${id}`);





/* ===================== HAULAGE ===================== */

// Create haulage
export const addHaulage = (data: any) =>
  axios.post(`${baseUrl}/haulage`, data);

// Get all haulages
export const getHaulages = () =>
  axios.get(`${baseUrl}/haulage`);

// Get haulage by ID
export const getHaulageById = (id: string) =>
  axios.get(`${baseUrl}/haulage/${id}`);

// Update haulage by ID
export const updateHaulage = (id: string, data: any) =>
  axios.put(`${baseUrl}/haulage/${id}`, data);

// Delete haulage by ID
export const deleteHaulage = (id: string) =>
  axios.delete(`${baseUrl}/haulage/${id}`);