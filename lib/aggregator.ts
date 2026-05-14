import axios from 'axios';
import { Redis } from '@upstash/redis';

// ================= CONFIGURATION =================
const REDIS_URL = "https://winning-lioness-97755.upstash.io";
const REDIS_TOKEN = "gQAAAAAAAX3bAAIgcDExMDY4NGY2OWZlZGY0OWY0ODA0NmNmZDNlM2JhNGUxOA";

export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

export const ACCOUNTS = [
  { phone: "9140256954", pass: "Vikas@9651" },
  { phone: "9508063031", pass: "Soni@95080" },
  { phone: "6260590329", pass: "Rahul@123" }
];

const BASE_URL = "https://sachinacademyapi.classx.co.in";

const COMMON_HEADERS = {
  "Auth-Key": "appxapi",
  "Client-Service": "Appx",
  "Source": "website",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/146.0.0.0 Safari/537.36",
  "Origin": "https://sachinacademy.classx.co.in",
  "Referer": "https://sachinacademy.classx.co.in/"
};

// ================= AUTH CORE =================

export async function performLogin(phone: string, password: string) {
  const formData = new FormData();
  formData.append("source", "website");
  formData.append("phone", phone);
  formData.append("email", phone);
  formData.append("password", password);
  formData.append("extra_details", "1");

  try {
    const response = await axios.post(`${BASE_URL}/post/userLogin?extra_details=0`, formData, {
      headers: {
        ...COMMON_HEADERS,
      }
    });

    const data = response.data;
    if (response.status === 200 && data.status === 200) {
      const token = data.data.token;
      const userid = String(data.data.userid);
      await redis.set(`token:${phone}`, token);
      await redis.set(`userid:${phone}`, userid);
      return { token, userid, phone };
    }
  } catch (e) {
    console.error(`[ERROR] Login failed for ${phone}:`, e);
  }
  return null;
}

export async function getValidAuth() {
  const shuffledAccounts = [...ACCOUNTS].sort(() => Math.random() - 0.5);
  for (const acc of shuffledAccounts) {
    const token = await redis.get<string>(`token:${acc.phone}`);
    const userid = await redis.get<string>(`userid:${acc.phone}`);
    if (token && userid) {
      return { token, userid, phone: acc.phone };
    }
  }

  // If no token exists, login with the first one
  const newAuth = await performLogin(ACCOUNTS[0].phone, ACCOUNTS[0].pass);
  return newAuth;
}

export async function getValidAuthForCourse(courseid: string | null) {
  if (!courseid) return await getValidAuth();
  
  const phone = await redis.get<string>(`courseOwner:${courseid}`);
  if (phone) {
    const token = await redis.get<string>(`token:${phone}`);
    const userid = await redis.get<string>(`userid:${phone}`);
    if (token && userid) {
      return { token, userid, phone };
    }
    
    // Login specifically for this phone if token is expired
    const account = ACCOUNTS.find(a => a.phone === phone);
    if (account) {
      const auth = await performLogin(account.phone, account.pass);
      if (auth) return auth;
    }
  }
  
  // Fallback
  return await getValidAuth();
}

export async function fetchApi(path: string, params: any = {}, authData: any = null) {
  let auth = authData;
  if (!auth) {
    // If courseid is in params, try to use course owner auth
    const cid = params.courseid || params.course_id;
    if (cid) {
       auth = await getValidAuthForCourse(cid);
    } else {
       auth = await getValidAuth();
    }
  }

  if (!auth) {
    throw new Error("Authentication failed for all accounts.");
  }

  try {
    const finalParams = { ...params, userid: auth.userid };
    
    const response = await axios.get(`${BASE_URL}${path}`, {
      headers: {
        ...COMMON_HEADERS,
        "Authorization": auth.token,
        "User-Id": auth.userid
      },
      params: finalParams
    });

    if (response.status === 401 || response.status === 403) {
      return { error: "reauth_needed" };
    }

    return response.data;
  } catch (error) {
    console.error(`API Fetch Error [${path}]:`, error);
    throw error;
  }
}
