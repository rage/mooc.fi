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

You then might define the query in the frontend as follows:

```typescript
export const StaffMemberDetailsQueryDefinition = gql`
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
`
```

Run `npm run graphql-codegen` in the frontend folder. This will generate a bucketload of useful typings and other code.

The most useful is the `StaffMemberDetailsDocument`, which is a correctly typed document node for the GraphQL operation, also providing the result type automatically. The result type is available separately as `StaffMemberDetailsQuery` and the operation variables as `StaffMemberDetailsVariables`. Also, the model definition is available as `StaffMember` -- do note that it includes all the fields exposed in the GraphQL schema, not just the ones that are actually used in the query. If you're using only a subselection of fields for a query and passing the result to a component, you might want to create a fragment for the fields you're using and use the generated type.

You can now use the query in the frontend as follows:

```typescript
import { StaffMemberDetailsDocument } from "/static/types/generated"

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

Note that the generator creates types formed from the name of the query you defined in the frontend (here: `StaffMemberDetails`) and _not_ the name of the variable you have given it (here: `StaffMemberDetailsQueryDefinition`). You _can_ use this exported variable as the operation, but in that case you have to provide the result type yourself, ie. `useQuery<StaffMemberDetailsQuery>(StaffMemberDetailsQueryDefinition)`,
