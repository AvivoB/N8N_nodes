import { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function typesenseApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function validateCollectionSchema(schema: IDataObject): void;
export declare function buildSearchParams(searchParams: IDataObject): IDataObject;
