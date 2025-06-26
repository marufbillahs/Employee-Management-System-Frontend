import { jwtDecode } from 'jwt-decode';

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (err) {
    return false;
  }
}
