import { ApiKeyStrategy, createClient, OAuthStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { submissions } from "@wix/forms";

const isDebugMode = process.env.DEBUG_LOGS === "1";

export const logError = (...args) => {
    if (isDebugMode) console.error(...args);
};

export const createWixClient = async () => {
    try {
        const wixClient = createClient({
            modules: {
                collections,
                items,
                submissions,
            },
            auth: ApiKeyStrategy({
                siteId: process.env.SITE_ID_WIX,
                apiKey: process.env.API_KEY_WIX,
            })
        });
        return wixClient;
    } catch (error) {
        logError("Error creating wix client: ", error);
    }
};

export const createWixClientOAuth = async () => {
    try {
        const wixClient = createClient({
            modules: {
                collections,
                items,
                submissions,
            },
            auth: OAuthStrategy({ clientId: process.env.CLIENT_ID_WIX }),
        });
        return wixClient;
    } catch (error) {
        logError("Error creating wix client: ", error);
    }
};