import { gql } from "apollo-boost"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"

export const UserPointsQuery = gql`
  query UserPoints {
    currentUser {
      ...UserPointsFragment
    }
  }
  ${PointsListItemCard.fragments.user}
`
