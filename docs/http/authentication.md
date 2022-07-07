---
sidebar_position: 1
---

# Authentication

After [creating an access key](/docs/unity/install#generate-an-access-key), you should use it in the `Authorization` header:

```
curl \
-X POST \
-H 'Authorization: Bearer eyJhb..........w5c' \
-H 'Content-type: application/json' \
'https://api.trytalo.com/v1/events'
```
