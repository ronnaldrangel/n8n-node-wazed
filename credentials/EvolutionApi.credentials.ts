import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class EvolutionApi implements ICredentialType {
	name = 'wazendApi';
	displayName = 'Wazend API';
	documentationUrl = 'https://docs.wazend.net/';
	properties: INodeProperties[] = [
		{
			displayName: 'URL del Servidor',
			name: 'server-url',
			type: 'string',
			default: '',
			placeholder: 'https://ejemplo.com',
			description: 'Introduce la URL completa de tu Evolution API (ej: https://api.ejemplo.com)',
		},
		{
			displayName: 'Clave API',
			name: 'apikey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'Introduce la Clave API de la instancia o global de tu Evolution API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				apikey: '={{$credentials.apikey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials["server-url"]}}',
			url: '={{$credentials["server-url"].endsWith("/") ? "/erro" : "/instance/fetchInstances"}}',
			method: 'GET',
			headers: {
				apikey: '={{$credentials.apikey}}',
			},
		},
	};
}