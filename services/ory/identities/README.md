# Identity Management

This guide provides commands to manually manage identities in Ory Kratos via its Admin API.

All commands should be run from a terminal that can access `localhost`.

The Kratos Admin API is exposed through the Caddy reverse proxy at `http://localhost/kratos-admin/`.

## List All Identities

This command retrieves a list of all identities in the system.

```sh
curl -s "http://localhost/kratos-admin/admin/identities" | jq
```

*(The `| jq` part is optional and formats the JSON output for readability. You may need to install `jq`.)*

## Delete an Identity

Use this command to permanently delete an identity. You will need the `identity_id` from the list command above.

```sh
# Replace {identity_id} with the actual ID of the user to delete
curl -X DELETE "http://localhost/kratos-admin/admin/identities/{identity_id}"
```

## Disable (Deactivate) an Identity

This is a less destructive alternative to deleting. It prevents the user from logging in but keeps their data. To do this, we update the identity and set its `state` to `inactive`.

### 1. Get the Identity Details

First, you need the current details of the identity to get its `traits` and current `metadata`.

```sh
# Replace {identity_id} with the actual ID
curl -s "http://localhost/kratos-admin/admin/identities/{identity_id}" > identity.json
```

This saves the identity to a file named `identity.json`.

### 2. Update the Identity

Now, use the `identity.json` file to update the identity. The command below sets the state to `inactive`.

```sh
# Replace {identity_id} with the actual ID
curl -X PUT "http://localhost/kratos-admin/admin/identities/{identity_id}" \
  -H "Content-Type: application/json" \
  --data '{ 
    "schema_id": "default",
    "state": "inactive",
    "traits": '$(jq .traits identity.json)'
  }'
```

To re-enable the user, run the same command with `"state": "active"`.
