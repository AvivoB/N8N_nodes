import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { typesenseApiRequest } from './GenericFunctions';

export class Typesense implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Typesense',
		name: 'typesense',
		icon: 'file:typesense.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Typesense search engine',
		defaults: {
			name: 'Typesense',
		},		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'typesenseApi',
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
						name: 'Collection',
						value: 'collection',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Search',
						value: 'search',
					},
				],
				default: 'collection',
			},

			// Collection operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['collection'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a collection',
						action: 'Create a collection',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a collection',
						action: 'Delete a collection',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a collection',
						action: 'Get a collection',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all collections',
						action: 'Get all collections',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a collection',
						action: 'Update a collection',
					},
				],
				default: 'create',
			},

			// Document operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a document',
						action: 'Create a document',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
						action: 'Delete a document',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a document',
						action: 'Get a document',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a document',
						action: 'Update a document',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Upsert a document',
						action: 'Upsert a document',
					},
				],
				default: 'create',
			},

			// Search operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search documents',
						action: 'Search documents',
					},
					{
						name: 'Multi Search',
						value: 'multiSearch',
						description: 'Perform multiple searches',
						action: 'Perform multiple searches',
					},
				],
				default: 'search',
			},

			// Collection Name (for all operations that need it)
			{
				displayName: 'Collection Name',
				name: 'collectionName',
				type: 'string',
				default: '',
				placeholder: 'my_collection',
				displayOptions: {
					show: {
						resource: ['collection', 'document', 'search'],
						operation: ['get', 'delete', 'update', 'create', 'search', 'upsert'],
					},
					hide: {
						resource: ['collection'],
						operation: ['getAll'],
					},
				},
				description: 'Name of the collection',
			},

			// Collection Schema (for create collection)
			{
				displayName: 'Collection Schema',
				name: 'collectionSchema',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['create'],
					},
				},
				default: '{\n  "name": "companies",\n  "fields": [\n    {"name": "company_name", "type": "string"},\n    {"name": "num_employees", "type": "int32"},\n    {"name": "country", "type": "string", "facet": true}\n  ],\n  "default_sorting_field": "num_employees"\n}',
				description: 'The collection schema as JSON',
			},

			// Document ID
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'delete', 'update'],
					},
				},
				description: 'ID of the document',
			},

			// Document Data
			{
				displayName: 'Document Data',
				name: 'documentData',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				default: '{\n  "id": "1",\n  "company_name": "Stark Industries",\n  "num_employees": 5215,\n  "country": "USA"\n}',
				description: 'The document data as JSON',
			},

			// Search Query
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '*',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['search'],
					},
				},
				description: 'The search query string',
			},

			// Query By Fields
			{
				displayName: 'Query By Fields',
				name: 'queryBy',
				type: 'string',
				default: '',
				placeholder: 'company_name,country',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['search'],
					},
				},
				description: 'Comma-separated list of fields to query by',
			},

			// Additional Options
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Filter By',
						name: 'filterBy',
						type: 'string',
						default: '',
						placeholder: 'num_employees:>100',
						description: 'Filter results by field values',
					},
					{
						displayName: 'Sort By',
						name: 'sortBy',
						type: 'string',
						default: '',
						placeholder: 'num_employees:desc',
						description: 'Sort results by field',
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						default: 10,
						description: 'Number of results to return per page',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number to retrieve',
					},
					{
						displayName: 'Facet By',
						name: 'facetBy',
						type: 'string',
						default: '',
						placeholder: 'country',
						description: 'Comma-separated list of fields to facet by',
					},
					{
						displayName: 'Max Facet Values',
						name: 'maxFacetValues',
						type: 'number',
						default: 10,
						description: 'Maximum number of facet values to return',
					},
				],
			},

			// Multi Search Queries
			{
				displayName: 'Search Queries',
				name: 'searchQueries',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['multiSearch'],
					},
				},
				default: '{\n  "searches": [\n    {\n      "collection": "companies",\n      "q": "*",\n      "query_by": "company_name"\n    }\n  ]\n}',
				description: 'Multiple search queries as JSON',
			},

			// Update Schema (for collection update)
			{
				displayName: 'Update Schema',
				name: 'updateSchema',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['update'],
					},
				},
				default: '{\n  "fields": [\n    {"name": "new_field", "type": "string", "drop": false}\n  ]\n}',
				description: 'The schema updates as JSON',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'collection') {
					if (operation === 'create') {
						const collectionSchema = this.getNodeParameter('collectionSchema', i);
						const schema = typeof collectionSchema === 'string' 
							? JSON.parse(collectionSchema) 
							: collectionSchema;

						responseData = await typesenseApiRequest.call(
							this,
							'POST',
							'/collections',
							schema,
						);
					} else if (operation === 'get') {
						const collectionName = this.getNodeParameter('collectionName', i) as string;
						responseData = await typesenseApiRequest.call(
							this,
							'GET',
							`/collections/${collectionName}`,
						);
					} else if (operation === 'getAll') {
						responseData = await typesenseApiRequest.call(
							this,
							'GET',
							'/collections',
						);
					} else if (operation === 'delete') {
						const collectionName = this.getNodeParameter('collectionName', i) as string;
						responseData = await typesenseApiRequest.call(
							this,
							'DELETE',
							`/collections/${collectionName}`,
						);
					} else if (operation === 'update') {
						const collectionName = this.getNodeParameter('collectionName', i) as string;
						const updateSchema = this.getNodeParameter('updateSchema', i);
						const schema = typeof updateSchema === 'string' 
							? JSON.parse(updateSchema) 
							: updateSchema;

						responseData = await typesenseApiRequest.call(
							this,
							'PATCH',
							`/collections/${collectionName}`,
							schema,
						);
					}
				} else if (resource === 'document') {
					const collectionName = this.getNodeParameter('collectionName', i) as string;

					if (operation === 'create') {
						const documentData = this.getNodeParameter('documentData', i);
						const document = typeof documentData === 'string' 
							? JSON.parse(documentData) 
							: documentData;

						responseData = await typesenseApiRequest.call(
							this,
							'POST',
							`/collections/${collectionName}/documents`,
							document,
						);
					} else if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await typesenseApiRequest.call(
							this,
							'GET',
							`/collections/${collectionName}/documents/${documentId}`,
						);
					} else if (operation === 'update') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						const documentData = this.getNodeParameter('documentData', i);
						const document = typeof documentData === 'string' 
							? JSON.parse(documentData) 
							: documentData;

						responseData = await typesenseApiRequest.call(
							this,
							'PATCH',
							`/collections/${collectionName}/documents/${documentId}`,
							document,
						);
					} else if (operation === 'upsert') {
						const documentData = this.getNodeParameter('documentData', i);
						const document = typeof documentData === 'string' 
							? JSON.parse(documentData) 
							: documentData;

						responseData = await typesenseApiRequest.call(
							this,
							'POST',
							`/collections/${collectionName}/documents?action=upsert`,
							document,
						);
					} else if (operation === 'delete') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await typesenseApiRequest.call(
							this,
							'DELETE',
							`/collections/${collectionName}/documents/${documentId}`,
						);
					}
				} else if (resource === 'search') {
					if (operation === 'search') {
						const collectionName = this.getNodeParameter('collectionName', i) as string;
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;
						const queryBy = this.getNodeParameter('queryBy', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						const searchParams: any = {
							q: searchQuery,
							query_by: queryBy,
						};

						if (additionalFields.filterBy) {
							searchParams.filter_by = additionalFields.filterBy;
						}
						if (additionalFields.sortBy) {
							searchParams.sort_by = additionalFields.sortBy;
						}
						if (additionalFields.perPage) {
							searchParams.per_page = additionalFields.perPage;
						}
						if (additionalFields.page) {
							searchParams.page = additionalFields.page;
						}
						if (additionalFields.facetBy) {
							searchParams.facet_by = additionalFields.facetBy;
						}
						if (additionalFields.maxFacetValues) {
							searchParams.max_facet_values = additionalFields.maxFacetValues;
						}

						responseData = await typesenseApiRequest.call(
							this,
							'GET',
							`/collections/${collectionName}/documents/search`,
							{},
							searchParams,
						);
					} else if (operation === 'multiSearch') {
						const searchQueries = this.getNodeParameter('searchQueries', i);
						const queries = typeof searchQueries === 'string' 
							? JSON.parse(searchQueries) 
							: searchQueries;

						responseData = await typesenseApiRequest.call(
							this,
							'POST',
							'/multi_search',
							queries,
						);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData || {} });
				}		} catch (error: any) {
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
