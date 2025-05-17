// lib/services/datasource.js
import { INSIGHTO_API_URL, INSIGHTO_API_KEY } from '@/lib/utils'
/**
 * Fetch all datasources.
 */

export const fetchDataSources = async () => {
    const response = await fetch(`${INSIGHTO_API_URL}/datasource/get_my_details?api_key=${INSIGHTO_API_KEY}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data sources");
    }
    return response.json();
};

/**
 * Create a new datasource.
 * @param {Object} payload - The JSON payload for datasource creation.
 */
export const createDataSource = async (payload) => {
    const response = await fetch(`${INSIGHTO_API_URL}/datasource?api_key=${INSIGHTO_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error("Failed to create data source");
    }
    return response.json();
};

/**
 * Upload a file to the datasource.
 * @param {string} datasourceId - The ID returned from the create call.
 * @param {File} file - The file object to upload.
 * @param {Object} queryParams - Query parameters as an object.
 */
export const uploadDataSourceFile = async (datasourceId, file, queryParams) => {
    let data = new FormData();

    if (queryParams.ds_type === 'text_blob') {
        data = JSON.stringify({ text_blob: file })
    } else {
        data = new FormData();
        data.append('datasourcefile_file', file);
    }
    const params = new URLSearchParams(queryParams).toString();
    const response = await fetch(
        `${INSIGHTO_API_URL}/datasource/${datasourceId}/${queryParams.ds_type === 'text_blob' ? 'text_blob' : 'file'}?datasource_id=${datasourceId}&${params}&api_key=${INSIGHTO_API_KEY}`,
        {
            method: "POST",
            headers: queryParams.ds_type === 'text_blob' ? { "Content-Type": "application/json" } : {},
            body: data,
        }
    );
    if (!response.ok) {
        throw new Error("Failed to upload datasource file");
    }
    return response.json();
};

/**
 * Delete a datasource.
 * @param {string} datasourceId - The datasource ID to delete.
 */
export const deleteDataSource = async (datasourceId) => {
    const response = await fetch(`${INSIGHTO_API_URL}/datasource/${datasourceId}?api_key=${INSIGHTO_API_KEY}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete data source");
    }
    return response.json();
};

// --- API Helper Functions --- //

export const fetchDataSourceFiles = async (datasourceId) => {
    const response = await fetch(`${INSIGHTO_API_URL}/datasource/${datasourceId}/datasourcefiles?api_key=${INSIGHTO_API_KEY}`);
    if (!response.ok) {
        throw new Error("Failed to fetch datasource files");
    }
    return response.json();
};

export const deleteDataSourceFromAssistant = async (assistantId, datasourceId) => {
    const response = await fetch(`${INSIGHTO_API_URL}/datasource/${datasourceId}/${assistantId}/LinkedAssistantDataSource?api_key=${INSIGHTO_API_KEY}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete data source");
    }
    return response.json();
};