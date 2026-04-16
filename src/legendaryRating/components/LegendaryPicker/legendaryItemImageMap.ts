import type { CategoryId } from "../../types/models";

export type LegendaryItemImageMap = Record<string, string>;

const loadDefaultExport = async (
    loader: Promise<{ default: LegendaryItemImageMap }>,
): Promise<LegendaryItemImageMap> => {
    return loader.then(({ default: legendaryItemImageMap }) => legendaryItemImageMap);
};

export const loadLegendaryThumbnailMap = (categoryId: CategoryId): Promise<LegendaryItemImageMap> => {
    switch (categoryId) {
        case "oneHanded":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-thumbnail-oneHanded" */
                    "./generated/legendaryThumbnailMap.oneHanded"
                ),
            );
        case "twoHanded":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-thumbnail-twoHanded" */
                    "./generated/legendaryThumbnailMap.twoHanded"
                ),
            );
        case "ranged":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-thumbnail-ranged" */
                    "./generated/legendaryThumbnailMap.ranged"
                ),
            );
        case "shield":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-thumbnail-shield" */
                    "./generated/legendaryThumbnailMap.shield"
                ),
            );
        case "helmet":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-thumbnail-helmet" */
                    "./generated/legendaryThumbnailMap.helmet"
                ),
            );
        case "armor":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-thumbnail-armor" */
                    "./generated/legendaryThumbnailMap.armor"
                ),
            );
        default:
            return Promise.resolve({});
    }
};

export const loadLegendaryPreviewMap = (categoryId: CategoryId): Promise<LegendaryItemImageMap> => {
    switch (categoryId) {
        case "oneHanded":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-preview-oneHanded" */
                    "./generated/legendaryPreviewMap.oneHanded"
                ),
            );
        case "twoHanded":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-preview-twoHanded" */
                    "./generated/legendaryPreviewMap.twoHanded"
                ),
            );
        case "ranged":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-preview-ranged" */
                    "./generated/legendaryPreviewMap.ranged"
                ),
            );
        case "shield":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-preview-shield" */
                    "./generated/legendaryPreviewMap.shield"
                ),
            );
        case "helmet":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-preview-helmet" */
                    "./generated/legendaryPreviewMap.helmet"
                ),
            );
        case "armor":
            return loadDefaultExport(
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "legendary-preview-armor" */
                    "./generated/legendaryPreviewMap.armor"
                ),
            );
        default:
            return Promise.resolve({});
    }
};
