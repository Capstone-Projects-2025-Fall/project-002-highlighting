import data, { buildTilesFromBackend } from "@/data/AAC/Tiles";

/**
 * Synchronous getter that returns the static, in-repo tile data.
 * Keep this as the non-breaking fallback for callers that expect a synchronous value.
 */
export function getAACAssets() {
    return data;
}

/**
 * Async getter that will attempt to build tiles from the backend.
 * Falls back to the static `data` if the backend call fails or is unavailable.
 */
export async function getAACAssetsAsync() {
    try {
        const built = await buildTilesFromBackend();
        if (built && Object.keys(built).length > 0) return built;
    } catch (e) {
        // swallow and return fallback
        // eslint-disable-next-line no-console
        console.debug("buildTilesFromBackend failed, falling back to static tiles", e);
    }
    return data;
}
