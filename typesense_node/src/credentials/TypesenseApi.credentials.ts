import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TypesenseApi implements ICredentialType {
	name = 'typesenseApi';

	displayName = 'Typesense API';

	documentationUrl = 'https://typesense.org/docs/';

	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'localhost',
			placeholder: 'localhost',
			description: 'The Typesense server host',
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 8108,
			description: 'The Typesense server port',
		},
		{
			displayName: 'Protocol',
			name: 'protocol',
			type: 'options',
			options: [
				{
					name: 'HTTP',
					value: 'http',
				},
				{
					name: 'HTTPS',
					value: 'https',
				},
			],
			default: 'http',
			description: 'The protocol to use',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The Typesense API key',
		},
	];
}
