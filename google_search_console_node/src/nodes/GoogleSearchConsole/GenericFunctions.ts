import {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export async function googleApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
): Promise<any> {
	const credentials = await this.getCredentials('googleSearchConsoleOAuth2Api');

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const options: IRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		uri: uri || `https://www.googleapis.com/webmasters/v3${resource}`,
		json: true,
	};

	// Remove empty body for GET and DELETE requests
	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}
	try {
		return await this.helpers.requestOAuth2.call(this, 'googleSearchConsoleOAuth2Api', options);
	} catch (error: any) {
		// Enhanced error handling for Google API errors
		if (error.statusCode === 400) {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Bad Request - Invalid parameters',
				httpCode: '400',
			});
		}
		
		if (error.statusCode === 401) {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Unauthorized - Check your OAuth2 credentials',
				httpCode: '401',
			});
		}

		if (error.statusCode === 403) {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Forbidden - Insufficient permissions or quota exceeded',
				httpCode: '403',
			});
		}

		if (error.statusCode === 404) {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Not Found - Site or resource does not exist',
				httpCode: '404',
			});
		}

		if (error.statusCode === 429) {
			throw new NodeApiError(this.getNode(), error, {
				message: 'Too Many Requests - Rate limit exceeded',
				httpCode: '429',
			});
		}

		throw new NodeApiError(this.getNode(), error);
	}
}

export async function googleApiRequestAllItems(
	this: IExecuteFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.startIndex = 0;
	query.startRow = 0;

	do {
		responseData = await googleApiRequest.call(this, method, endpoint, body, query);
		
		if (responseData[propertyName]) {
			returnData.push.apply(returnData, responseData[propertyName]);
		}

		// Handle pagination for different Google API responses
		if (responseData.nextPageToken) {
			query.pageToken = responseData.nextPageToken;
		} else if (responseData.startIndex !== undefined) {
			query.startIndex = responseData.startIndex + responseData.itemsPerPage;
		} else {
			break;
		}

	} while (
		responseData.nextPageToken ||
		(responseData.startIndex !== undefined && responseData.startIndex < responseData.totalResults)
	);

	return returnData;
}

/**
 * Helper function to format site URL for Google Search Console API
 */
export function formatSiteUrl(url: string): string {
	// Remove trailing slash if present
	url = url.replace(/\/$/, '');
	
	// Add protocol if missing
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		url = 'https://' + url;
	}

	return url;
}

/**
 * Helper function to validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): boolean {
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(date)) {
		return false;
	}
	
	const dateObj = new Date(date);
	return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * Helper function to build search analytics query body
 */
export function buildSearchAnalyticsQuery(parameters: IDataObject): IDataObject {
	const body: IDataObject = {};

	// Required fields
	if (parameters.startDate) {
		body.startDate = parameters.startDate;
	}
	if (parameters.endDate) {
		body.endDate = parameters.endDate;
	}

	// Optional fields
	if (parameters.dimensions && Array.isArray(parameters.dimensions)) {
		body.dimensions = parameters.dimensions;
	}

	if (parameters.searchType) {
		body.searchType = parameters.searchType;
	}

	if (parameters.dimensionFilterGroups && Array.isArray(parameters.dimensionFilterGroups)) {
		body.dimensionFilterGroups = parameters.dimensionFilterGroups;
	}

	if (parameters.aggregationType) {
		body.aggregationType = parameters.aggregationType;
	}

	if (parameters.rowLimit) {
		body.rowLimit = parameters.rowLimit;
	}

	if (parameters.startRow) {
		body.startRow = parameters.startRow;
	}

	return body;
}
