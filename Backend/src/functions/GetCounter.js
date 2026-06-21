const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

app.http('GetCounter', {
    methods: ['GET'],
    authLevel: 'anonymous',

    handler: async (request, context) => {

        const connStr =
            process.env.AZURE_STORAGE_CONNECTION_STRING;

        const tableClient =
            TableClient.fromConnectionString(
                connStr,
                'visitorcount'
            );

        let entity;

        try {
            entity = await tableClient.getEntity(
                'visitors',
                'count'
            );
        } catch {
            entity = {
                partitionKey: 'visitors',
                rowKey: 'count',
                Count: 0
            };

            await tableClient.createEntity(entity);
        }

        entity.Count += 1;

        await tableClient.updateEntity(entity);

        return {
            status: 200,
            body: entity.Count.toString()
        };
    }
});