import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import {
	googleApiRequest,
	googleApiRequestAllItems,
	formatSiteUrl,
	validateDateFormat,
	buildSearchAnalyticsQuery,
} from './GenericFunctions';

export class GoogleSearchConsole implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Search Console',
		name: 'googleSearchConsole',
		icon: 'file:googleSearchConsole.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Google Search Console API',
		defaults: {
			name: 'Google Search Console',
		},		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'googleSearchConsoleOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Site',
						value: 'site',
					},
					{
						name: 'Search Analytics',
						value: 'searchAnalytics',
					},
					{
						name: 'Sitemap',
						value: 'sitemap',
					},
					{
						name: 'URL Inspection',
						value: 'urlInspection',
					},
				],
				default: 'site',
			},

			// ===========================================
			//              Site Operations
			// ===========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['site'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get information about a specific site',
						action: 'Get a site',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'List all sites in Search Console',
						action: 'Get all sites',
					},
					{
						name: 'Add',
						value: 'add',
						description: 'Add a site to Search Console',
						action: 'Add a site',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Remove a site from Search Console',
						action: 'Delete a site',
					},
				],
				default: 'getAll',
			},

			// ===========================================
			//         Search Analytics Operations
			// ===========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['searchAnalytics'],
					},
				},
				options: [
					{
						name: 'Query',
						value: 'query',
						description: 'Query search analytics data',
						action: 'Query search analytics',
					},
				],
				default: 'query',
			},

			// ===========================================
			//           Sitemap Operations
			// ===========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sitemap'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get information about a specific sitemap',
						action: 'Get a sitemap',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'List all sitemaps for a site',
						action: 'Get all sitemaps',
					},
					{
						name: 'Submit',
						value: 'submit',
						description: 'Submit a sitemap to Google',
						action: 'Submit a sitemap',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a sitemap',
						action: 'Delete a sitemap',
					},
				],
				default: 'getAll',
			},

			// ===========================================
			//        URL Inspection Operations
			// ===========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['urlInspection'],
					},
				},
				options: [
					{
						name: 'Inspect',
						value: 'inspect',
						description: 'Get URL inspection data',
						action: 'Inspect URL',
					},
				],
				default: 'inspect',
			},

			// ===========================================
			//              Site URL Field
			// ===========================================
			{
				displayName: 'Site URL',
				name: 'siteUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['site', 'searchAnalytics', 'sitemap', 'urlInspection'],
						operation: ['get', 'add', 'delete', 'query', 'getAll', 'submit', 'inspect'],
					},
					hide: {
						resource: ['site'],
						operation: ['getAll'],
					},
				},
				default: '',
				placeholder: 'https://example.com/',
				description: 'The URL of the site in Search Console',
			},

			// ===========================================
			//         Search Analytics Fields
			// ===========================================
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['searchAnalytics'],
						operation: ['query'],
					},
				},
				default: '',
				description: 'Start date for the query (YYYY-MM-DD format)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['searchAnalytics'],
						operation: ['query'],
					},
				},
				default: '',
				description: 'End date for the query (YYYY-MM-DD format)',
			},
			{
				displayName: 'Dimensions',
				name: 'dimensions',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['searchAnalytics'],
						operation: ['query'],
					},
				},
				options: [
					{
						name: 'Country',
						value: 'country',
					},
					{
						name: 'Device',
						value: 'device',
					},
					{
						name: 'Page',
						value: 'page',
					},
					{
						name: 'Query',
						value: 'query',
					},
					{
						name: 'Search Appearance',
						value: 'searchAppearance',
					},
					{
						name: 'Date',
						value: 'date',
					},
				],
				default: ['query'],
				description: 'Dimensions to group results by',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['searchAnalytics'],
						operation: ['query'],
					},
				},
				options: [
					{
						displayName: 'Search Type',
						name: 'searchType',
						type: 'options',
						options: [
							{
								name: 'Web',
								value: 'web',
							},
							{
								name: 'Image',
								value: 'image',
							},
							{
								name: 'Video',
								value: 'video',
							},
							{
								name: 'News',
								value: 'news',
							},
						],
						default: 'web',
						description: 'Type of search to query',
					},
					{
						displayName: 'Row Limit',
						name: 'rowLimit',
						type: 'number',
						default: 1000,
						description: 'Maximum number of rows to return',
					},
					{
						displayName: 'Start Row',
						name: 'startRow',
						type: 'number',
						default: 0,
						description: 'Zero-based index of the first row to return',
					},
					{
						displayName: 'Aggregation Type',
						name: 'aggregationType',
						type: 'options',
						options: [
							{
								name: 'Auto',
								value: 'auto',
							},
							{
								name: 'By Page',
								value: 'byPage',
							},
							{
								name: 'By Property',
								value: 'byProperty',
							},
						],
						default: 'auto',
						description: 'How data is aggregated',
					},
					{
						displayName: 'Dimension Filters',
						name: 'dimensionFilterGroups',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								displayName: 'Filter Group',
								name: 'filterGroup',
								values: [
									{
										displayName: 'Group Type',
										name: 'groupType',
										type: 'options',
										options: [
											{
												name: 'And',
												value: 'and',
											},
										],
										default: 'and',
									},
									{
										displayName: 'Filters',
										name: 'filters',
										type: 'fixedCollection',
										typeOptions: {
											multipleValues: true,
										},
										default: {},
										options: [
											{
												displayName: 'Filter',
												name: 'filter',
												values: [
													{
														displayName: 'Dimension',
														name: 'dimension',
														type: 'options',
														options: [
															{
																name: 'Country',
																value: 'country',
															},
															{
																name: 'Device',
																value: 'device',
															},
															{
																name: 'Page',
																value: 'page',
															},
															{
																name: 'Query',
																value: 'query',
															},
															{
																name: 'Search Appearance',
																value: 'searchAppearance',
															},
														],
														default: 'query',
													},
													{
														displayName: 'Operator',
														name: 'operator',
														type: 'options',
														options: [
															{
																name: 'Contains',
																value: 'contains',
															},
															{
																name: 'Equals',
																value: 'equals',
															},
															{
																name: 'Not Contains',
																value: 'notContains',
															},
															{
																name: 'Not Equals',
																value: 'notEquals',
															},
															{
																name: 'Including Regex',
																value: 'includingRegex',
															},
															{
																name: 'Excluding Regex',
																value: 'excludingRegex',
															},
														],
														default: 'contains',
													},
													{
														displayName: 'Expression',
														name: 'expression',
														type: 'string',
														default: '',
														description: 'Value to filter by',
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},

			// ===========================================
			//            Sitemap Fields
			// ===========================================
			{
				displayName: 'Sitemap URL',
				name: 'sitemapUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sitemap'],
						operation: ['get', 'submit', 'delete'],
					},
				},
				default: '',
				placeholder: 'https://example.com/sitemap.xml',
				description: 'The URL of the sitemap',
			},

			// ===========================================
			//         URL Inspection Fields
			// ===========================================
			{
				displayName: 'Inspection URL',
				name: 'inspectionUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['urlInspection'],
						operation: ['inspect'],
					},
				},
				default: '',
				placeholder: 'https://example.com/page',
				description: 'The URL to inspect',
			},
			{
				displayName: 'Language Code',
				name: 'languageCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['urlInspection'],
						operation: ['inspect'],
					},
				},
				default: 'en-US',
				description: 'Language for the inspection results',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			let responseData;

			try {
				if (resource === 'site') {
					if (operation === 'getAll') {
						responseData = await googleApiRequest.call(this, 'GET', '/sites');
					} else if (operation === 'get') {
						const siteUrl = formatSiteUrl(this.getNodeParameter('siteUrl', i) as string);
						responseData = await googleApiRequest.call(
							this,
							'GET',
							`/sites/${encodeURIComponent(siteUrl)}`,
						);
					} else if (operation === 'add') {
						const siteUrl = formatSiteUrl(this.getNodeParameter('siteUrl', i) as string);
						responseData = await googleApiRequest.call(
							this,
							'PUT',
							`/sites/${encodeURIComponent(siteUrl)}`,
						);
					} else if (operation === 'delete') {
						const siteUrl = formatSiteUrl(this.getNodeParameter('siteUrl', i) as string);
						responseData = await googleApiRequest.call(
							this,
							'DELETE',
							`/sites/${encodeURIComponent(siteUrl)}`,
						);
					}
				} else if (resource === 'searchAnalytics') {
					if (operation === 'query') {
						const siteUrl = formatSiteUrl(this.getNodeParameter('siteUrl', i) as string);
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const dimensions = this.getNodeParameter('dimensions', i) as string[];
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						// Validate dates
						const startDateFormatted = startDate.split('T')[0];
						const endDateFormatted = endDate.split('T')[0];

						if (!validateDateFormat(startDateFormatted)) {
							throw new NodeOperationError(this.getNode(), 'Invalid start date format. Use YYYY-MM-DD.');
						}
						if (!validateDateFormat(endDateFormatted)) {
							throw new NodeOperationError(this.getNode(), 'Invalid end date format. Use YYYY-MM-DD.');
						}

						const searchAnalyticsQuery = buildSearchAnalyticsQuery({
							startDate: startDateFormatted,
							endDate: endDateFormatted,
							dimensions,
							...additionalFields,
						});

						responseData = await googleApiRequest.call(
							this,
							'POST',
							`/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
							searchAnalyticsQuery,
						);
					}
				} else if (resource === 'sitemap') {
					const siteUrl = formatSiteUrl(this.getNodeParameter('siteUrl', i) as string);

					if (operation === 'getAll') {
						responseData = await googleApiRequest.call(
							this,
							'GET',
							`/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
						);
					} else if (operation === 'get') {
						const sitemapUrl = this.getNodeParameter('sitemapUrl', i) as string;
						responseData = await googleApiRequest.call(
							this,
							'GET',
							`/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
						);
					} else if (operation === 'submit') {
						const sitemapUrl = this.getNodeParameter('sitemapUrl', i) as string;
						responseData = await googleApiRequest.call(
							this,
							'PUT',
							`/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
						);
					} else if (operation === 'delete') {
						const sitemapUrl = this.getNodeParameter('sitemapUrl', i) as string;
						responseData = await googleApiRequest.call(
							this,
							'DELETE',
							`/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
						);
					}
				} else if (resource === 'urlInspection') {
					if (operation === 'inspect') {
						const siteUrl = formatSiteUrl(this.getNodeParameter('siteUrl', i) as string);
						const inspectionUrl = this.getNodeParameter('inspectionUrl', i) as string;
						const languageCode = this.getNodeParameter('languageCode', i) as string;

						const body = {
							inspectionUrl,
							siteUrl,
							languageCode,
						};

						responseData = await googleApiRequest.call(
							this,
							'POST',
							'',
							body,
							{},
							'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
						);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData || {} });
				}			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
