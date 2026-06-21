import azure.functions as func
from azure.data.tables import TableClient
import os

def main(req: func.HttpRequest) -> func.HttpResponse:

    conn_str = os.environ["AZURE_STORAGE_CONNECTION_STRING"]

    table = TableClient.from_connection_string(
        conn_str=conn_str,
        table_name="visitorcount"
    )

    entity = table.get_entity(
        partition_key="visitors",
        row_key="count"
    )

    entity["Count"] += 1
    table.update_entity(entity)

    return func.HttpResponse(str(entity["Count"]))