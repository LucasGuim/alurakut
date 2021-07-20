import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(req, res) {
	if (req.method === 'POST') {
		const TOKEN_FULL = 'd593dd944953de4d829c7720d6ce9e';
		const client = new SiteClient(TOKEN_FULL);

		const registroCriado = await client.items.create({
			itemType: '975118',
			...req.body
			
		});

		res.json({
			dados: 'Algum dado',
			registroCriado: registroCriado
		});
		return;
	}

	res.status(404).json({
		message: 'Sem GET, apenas POST '
	});
}
