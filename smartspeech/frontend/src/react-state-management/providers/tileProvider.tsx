import { TileColor } from "@/components/AAC/Tile";
import { FlatTileAssets, TileAssets, TileData } from "@/components/AAC/TileTypes";
import { getTileFlatList } from "@/data/testing/AAC/flatListDataFile";
import { getAACAssets } from "@/util/AAC/getAACAssets";
import { fetchCategories } from "@/lib/api";
import getTilesByEmail, { GetTileData } from "@/util/CustomTile/getTilesByEmail";
import { EMPTY_FUNCTION } from "@/util/constants";
import { useSession } from "next-auth/react";
import React, { useState, useContext, createContext, useEffect } from "react";

interface TilesContext {
    tiles: TileAssets;
    flatList: FlatTileAssets;
    customTiles: GetTileData[];
    triggerRefreshCustomTiles: Function;
}

const tilesContext = createContext<TilesContext>({
    tiles: {},
    flatList: {},
    customTiles: [],
    triggerRefreshCustomTiles: EMPTY_FUNCTION,
});

export const useTilesProvider = () => {
    return useContext(tilesContext);
};

export interface TileProviderProps {
    children: React.ReactNode;
}

/**
 * Tile provider to expose collected tiles to the application. Currently it only exposes the default tiles available.
 * @returns
 */
export default function TileProvider({ children }: TileProviderProps) {
    const [tiles, setTiles] = useState<TileAssets>({});
    const [flatList, setFlatList] = useState<FlatTileAssets>({});
    const [customTiles, setCustomTiles] = useState<GetTileData[]>([]);
    const [refreshCustomTiles, setRefreshCustomTiles] = useState(0);
    const [loading, setLoading] = useState(false);

    const triggerRefreshCustomTiles = () => setRefreshCustomTiles((prev) => prev + 1);

    const { data: session, status } = useSession();

    useEffect(() => {
        // Load categories and words from backend and build tiles/flatList.
        // If backend doesn't include words with categories, fetch words per category.
        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                const categories: any[] = await fetchCategories();
                if (!mounted || !categories) return;

                // If categories already include words, use them; otherwise fetch words for each category in parallel.
                const needFetchWords = categories.length > 0 && !('words' in categories[0]);

                const categoriesWithWords = needFetchWords
                    ? await Promise.all(
                          categories.map(async (c) => {
                              try {
                                  const words = await (await import('@/lib/api')).fetchWords(c.id);
                                  return { ...c, words };
                              } catch (e) {
                                  return { ...c, words: [] };
                              }
                          }),
                      )
                    : categories;

                const tilesObj: TileAssets = {};
                const flatObj: FlatTileAssets = {};

                categoriesWithWords.forEach((cat: any) => {
                    const catName = cat.name || String(cat.id || 'Category');
                    const catTile: TileData = {
                        image:
                            (cat.words && cat.words[0] && cat.words[0].symbol) || '/AAC_assets/img/standard/cover.png',
                        text: catName,
                        tileColor: (cat.tileColor as TileColor) || ('blue' as TileColor),
                    };

                    const subTiles: TileAssets = {};
                    (cat.words || []).forEach((w: any) => {
                        const key = (w.text || '').toString();
                        const tile = {
                            image: w.symbol || '',
                            text: w.text || key,
                            sound: w.text || key,
                            tileColor:
                                (w.tileColor as TileColor) || (cat.tileColor as TileColor) || ('blue' as TileColor),
                        };
                        subTiles[key] = tile;

                        const flatKey = (w.text || key).toString().replace(/\s+/g, '').toLowerCase();
                        flatObj[flatKey] = {
                            image: tile.image,
                            text: tile.text,
                            sound: tile.sound,
                            tileColor: tile.tileColor,
                        };
                    });

                    catTile.subTiles = subTiles;
                    tilesObj[catName] = catTile;
                });

                if (mounted) {
                    setTiles(tilesObj);
                    setFlatList(flatObj);
                }
            } catch (e) {
                // fallback to packaged assets
                if (mounted) {
                    const tilesResp = getAACAssets();
                    setTiles(tilesResp);

                    const flatTileRes = getTileFlatList();
                    setFlatList(flatTileRes);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // flatList now built from backend data; keep fallback if still empty
    useEffect(() => {
        if (Object.keys(flatList).length === 0) {
            const flatTileRes = getTileFlatList();
            setFlatList(flatTileRes);
        }
    }, []);

    useEffect(() => {
        const email = session?.user?.email;
        if (!email || status !== "authenticated") return;

        const customTileDataPromise = getTilesByEmail(email).then((tiles) => {
            if (!tiles) return;
            setCustomTiles(tiles);
        });

        customTileDataPromise.catch((error) => console.log(error));
    }, [session?.user?.email, status, refreshCustomTiles]);

    useEffect(() => {
        if (!session?.user?.email) return;
        if (customTiles.length === 0) return;

        const customTilesView: TileData = {
            image: "/AAC_assets/img/standard/custom.png",
            text: "Custom Tiles",
            tileColor: "purple",
        };

        const customTilesViewSubtiles: TileAssets = {};

        customTiles.forEach((tile) => {
            const { text, sound, url, tileColor } = tile;

            customTilesViewSubtiles[tile.text] = {
                text,
                sound,
                image: url,
                tileColor: tileColor as TileColor,
            };
        });

        customTilesView.subTiles = customTilesViewSubtiles;

        setTiles({ ...tiles, "Custom Tiles": customTilesView });
    }, [customTiles, session?.user?.email]);

    const value: TilesContext = {
        tiles,
        flatList,
        customTiles,
        triggerRefreshCustomTiles,
    };

    return <tilesContext.Provider value={value}>{children}</tilesContext.Provider>;
}
