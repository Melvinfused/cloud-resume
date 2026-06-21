const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;

    const tableClient = TableClient.fromConnectionString(
        connStr,
        "visitorcount"
    );

    try {
        const entity = await tableClient.getEntity("visitors", "count");
        entity.Count += 1;
        await tableClient.updateEntity(entity);

        context.res = {
            status: 200,
            body: entity.Count.toString()
        };
    } catch (err) {
        context.log.error(err);
        context.res = {
            status: 500,
            body: "Error reading/updating visitor count"
        };
    }
};