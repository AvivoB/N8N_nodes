import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GoogleSearchConsoleOAuth2Api implements ICredentialType {
	name = 'googleSearchConsoleOAuth2Api';

	extends = ['googleOAuth2Api'];

	displayName = 'Google Search Console OAuth2 API';

	documentationUrl = 'https://developers.google.com/webmaster-tools/v1/getting_started';

	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters',
		},
	];
}
