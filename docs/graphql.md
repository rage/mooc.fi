# Working with GraphQL

## Frontend types

If you make changes to the GraphQL schema, resolvers etc. in the backend and/or the queries/mutations in the frontend, you probably need to regenerate the Typescript types for the frontend.

### In brief:

Ensure you have a fresh GraphQL schema in the backend by running `npm run generate` in the backend folder.

Then run `npm run graphql-codegen` in the frontend folder.

## Detailed example from backend to frontend:

You've created a model called `StaffMember` in the Prisma schema:

```prisma
model StaffMember {
  id                        String                  @id @default(uuid())
  user_id                   String?
  user                      User?                   @relation(fields: [user_id], references: [id])
  work_email                String?
  work_phone                String?
  created_at                DateTime?               @default(now())
  updated_at                DateTime?               @updatedAt

  @@map("staff_member)
}
```

You've also created the appropriate database migration and created a resolver for a query called `staffMember`, taking a single required parameter `id` of type `ID` and returing a `StaffMember` or `null` if none found.

First, ensure that you have a fresh GraphQL schema by running `npm run generate` in the backend folder. The generated schema is automatically linked to the frontend folder.

You then might define the query in the frontend as follows in a `.graphql` file situated somewhere in the `graphql` folder:

```graphql
query StaffMemberDetails($id: ID!) {
  staffMember(id: $id) {
    id
    user {
      id
      email
      name
    }
    work_email
    work_phone
  }
}
```

Note that even if you could leave the query unnamed, it would then be assigned a random name that's not very helpful in the context.

Run `npm run graphql-codegen` in the frontend folder. This will generate a bucketload of useful typings and other code.

The most useful is the `StaffMemberDetailsDocument`, which is a correctly typed document node for the GraphQL operation, also providing the result type automatically. The result type is available separately as `StaffMemberDetailsQuery` and the operation variables as `StaffMemberDetailsQueryVariables`. Also, the model definition is available as `StaffMember` -- do note that it includes all the fields exposed in the GraphQL schema, not just the ones that are actually used in the query. If you're using only a subselection of fields for a query and passing the result to a component, you might want to create a fragment for the fields you're using and use the generated type.

You can now use the query in the frontend as follows:

```typescript
import { StaffMemberDetailsDocument } from "/graphql/generated"

// in React components using the Apollo hooks:
function SayHello(id: string) {
  const { data, loading, error } = useQuery(StaffMemberDetailsDocument, {
    variables: {
      id,
    },
  })

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Hello, {data.staffMember?.user.name ?? "stranger"}</p>}
    </div>
  )
}

// or, if you're outside React components, assuming client is an ApolloClient instance
async function getStaffMemberDetails(client: ApolloClient<any>, id: string) {
  const { data } = await client.query({
    query: StaffMemberDetailsDocument,
    variables: { id },
  })

  return data?.staffMember
}
```

In both cases, the results of the query in `data` are typed correctly, so you would get `data.staffMember.work_email` for example -- provided that there is a user with the id that given as parameter.

The flow is similar with mutations and fragments. Mutation result and operation variable types are named similarly, only with `Mutation` instead of `Query`. Fragments do not produce result types; the type of the fragment is the defined name + `Fragment`.
