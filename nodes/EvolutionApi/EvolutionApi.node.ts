import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';
import { evolutionNodeProperties } from './properties';
import { resourceOperationsFunctions } from './execute';

export class EvolutionApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wazend API',
		name: 'wazendApi',
		icon: 'file:evolutionapi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with wazend API',
		defaults: {
			name: 'Wazend API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'wazendApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://docs.wazend.net/',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		// A estrutura de propriedades do nó:
		// • Resources: Recursos disponíveis (Instancia, Mensagens, Eventos, Integrações)
		// • Operations: Operações de cada recurso (Ex: Criar instancia, Enviar mensagem, Definir Webhook)
		// • Fields: Campos de cada operação
		properties: evolutionNodeProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Busca a função para o recurso e operação selecionados
		const fn = resourceOperationsFunctions[resource][operation];

		// Se não encontrar a função, retorna um erro
		if (!fn) {
			throw new NodeApiError(this.getNode(), {
				message: 'Operación no soportada.',
				description: `¡La funcion "${operation}" para el recurso  "${resource}" no es compatible!`,
			});
		}

		// Executa a função
		const responseData = await fn(this);

		// Retornar apenas o JSON
		return [this.helpers.returnJsonArray(responseData)];
	}
}
