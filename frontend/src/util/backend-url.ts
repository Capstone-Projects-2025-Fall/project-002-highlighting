import axios from "axios";

type HealthCheckSuccessResp = { message: string };

const DEFAULT_BACKEND_URL = "http://localhost:8000";

function normalize(url?: string) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    return trimmed.replace(/\/$/, "");
}

/**
 * Resolve the backend base URL.
 * Priority:
 * 1) NEXT_PUBLIC_API_BASE (new)
 * 2) NEXT_PUBLIC_BACKEND_URL_PROD (legacy prod)
 * 3) NEXT_PUBLIC_BACKEND_URL_DEV (legacy dev)
 * 4) DEFAULT_BACKEND_URL (localhost)
 */
export function getBackendUrl() {
    const apiBase = normalize(process.env.NEXT_PUBLIC_API_BASE);
    const legacyProd = normalize(process.env.NEXT_PUBLIC_BACKEND_URL_PROD);
    const legacyDev = normalize(process.env.NEXT_PUBLIC_BACKEND_URL_DEV);

    return apiBase || legacyProd || legacyDev || DEFAULT_BACKEND_URL;
}

export async function isBackendActive() {
    const url = `${getBackendUrl()}/health-check`;

    try {
        await axios.get<HealthCheckSuccessResp>(url);
    } catch (error) {
        return false;
    }

    return true;
}
