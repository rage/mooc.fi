## Development environment

Note: Before starting development, please run the following command on the repo root:

```bash
npm ci
```

frontend:

```bash
cd frontend
npm ci
npm run dev
```

backend:

```bash
cd backend
docker-compose up
```

```bash
cd backend
npm ci
npm run migrate
npm run dev
```

## Generating GraphQL types for frontend

If you make changes to the GraphQL schema, resolvers etc. in the backend and/or the queries/mutations in the frontend, you probably need to regenerate the Typescript types for the frontend.

### An example:

You know the backend has a resolver for a query called `getUser`.

First, ensure that you have a fresh GraphQL schema by running `npm run generate` in the backend folder. The generated schema is automatically linked to the frontend folder.

You then define the query in the frontend as follows:

```typescript
export const getUserQuery = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
    }
  }
`
```

Then run `npm run graphql-codegen` in the frontend folder. This will generate a bucketload of useful typing. You can now use the query as follows:

```typescript
import { GetUserDocument } from "/static/types/generated"

function SayHello() {
  const { data, loading, error } = useQuery(GetUserDocument, { id: "1" })

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Hello, {data.getUser.name ?? "stranger"}</p>}
    </div>
  )
}

// or, if you're outside React components:

async function getUserName(client: ApolloClient) {
  const { data } = await client.query({
    query: GetUserDocument,
    variables: { id: "1" },
  })

  return data?.getUser?.name
}
```

The results of the query in `data` are typed correctly, so you would get `data.getUser.name` for example -- provided that there is a user with id `1`.

Note that the generated document node name is formed from the name of the query you defined in the frontend (here: `GetUser`) and _not_ the name of the variable you have given it (here: `getUserQuery`). You can also use this `getUserQuery` variable as the query in the frontend, but in that case you have to provide the result type yourself.

Other useful typings generated in this case are `GetUserQueryVariables` which is the typing for the variables you can give this query and `GetUserQuery` which is the result type. The generated document node provides the latter automatically.

## Using installed `librdkafka` to speed up backend development

By default, `node-rdkafka` builds `librdkafka` from the source. This can take minutes on a bad day and can slow development down quite considerably. However, there's an option to use the version installed locally.

Do this in some other directory than the project one:

```bash
wget https://github.com/edenhill/librdkafka/archive/v1.8.2.tar.gz  -O - | tar -xz
cd librdkafka-1.8.2
./configure --prefix=/usr
make && make install
```

You may have to do some of that as root. Alternatively, you can install a prebuilt package - see [here](https://github.com/edenhill/librdkafka) for more information.

Set the env `BUILD_LIBRDKAFKA=0` when doing `npm ci` or similar on the backend to skip the build.

## Documentation

[Kafka](backend/docs/kafka.md)
