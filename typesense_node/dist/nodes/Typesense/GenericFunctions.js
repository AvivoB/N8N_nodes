"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typesenseApiRequest = typesenseApiRequest;
exports.validateCollectionSchema = validateCollectionSchema;
exports.buildSearchParams = buildSearchParams;
const n8n_workflow_1 = require("n8n-workflow");
async function typesenseApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('typesenseApi');
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    const protocol = credentials.protocol || 'http';
    const host = credentials.host;
    const port = credentials.port;
    const apiKey = credentials.apiKey;
    const baseUrl = `${protocol}://${host}:${port}`;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const options = {
        method,
        headers: {
            'X-TYPESENSE-API-KEY': apiKey,
            'Content-Type': 'application/json',
        },
        body,
        qs,
        uri: `${baseUrl}${cleanEndpoint}`,
        json: true,
    };
    if (method === 'GET' || method === 'DELETE') {
        delete options.body;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        if (error.statusCode === 400) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: 'Bad Request - Invalid parameters or malformed request',
                httpCode: '400',
            });
        }
        if (error.statusCode === 401) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: 'Unauthorized - Check your API key',
                httpCode: '401',
            });
        }
        if (error.statusCode === 404) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: 'Not Found - Collection or document does not exist',
                httpCode: '404',
            });
        }
        if (error.statusCode === 409) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: 'Conflict - Resource already exists',
                httpCode: '409',
            });
        }
        if (error.statusCode === 422) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: 'Unprocessable Entity - Invalid data format',
                httpCode: '422',
            });
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function validateCollectionSchema(schema) {
    if (!schema.name || typeof schema.name !== 'string') {
        throw new Error('Collection name is required and must be a string');
    }
    if (!schema.fields || !Array.isArray(schema.fields)) {
        throw new Error('Collection fields are required and must be an array');
    }
    for (const field of schema.fields) {
        if (!field.name || !field.type) {
            throw new Error('Each field must have a name and type');
        }
    }
}
function buildSearchParams(searchParams) {
    const params = {};
    if (searchParams.q) {
        params.q = searchParams.q;
    }
    if (searchParams.query_by) {
        params.query_by = searchParams.query_by;
    }
    if (searchParams.filter_by) {
        params.filter_by = searchParams.filter_by;
    }
    if (searchParams.sort_by) {
        params.sort_by = searchParams.sort_by;
    }
    if (searchParams.facet_by) {
        params.facet_by = searchParams.facet_by;
    }
    if (searchParams.max_facet_values) {
        params.max_facet_values = searchParams.max_facet_values;
    }
    if (searchParams.page) {
        params.page = searchParams.page;
    }
    if (searchParams.per_page) {
        params.per_page = searchParams.per_page;
    }
    if (searchParams.group_by) {
        params.group_by = searchParams.group_by;
    }
    if (searchParams.group_limit) {
        params.group_limit = searchParams.group_limit;
    }
    if (searchParams.include_fields) {
        params.include_fields = searchParams.include_fields;
    }
    if (searchParams.exclude_fields) {
        params.exclude_fields = searchParams.exclude_fields;
    }
    if (searchParams.highlight_full_fields) {
        params.highlight_full_fields = searchParams.highlight_full_fields;
    }
    if (searchParams.num_typos) {
        params.num_typos = searchParams.num_typos;
    }
    if (searchParams.prefix !== undefined) {
        params.prefix = searchParams.prefix;
    }
    if (searchParams.drop_tokens_threshold) {
        params.drop_tokens_threshold = searchParams.drop_tokens_threshold;
    }
    if (searchParams.typo_tokens_threshold) {
        params.typo_tokens_threshold = searchParams.typo_tokens_threshold;
    }
    if (searchParams.pinned_hits) {
        params.pinned_hits = searchParams.pinned_hits;
    }
    if (searchParams.hidden_hits) {
        params.hidden_hits = searchParams.hidden_hits;
    }
    return params;
}
