import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import { gql } from "@apollo/client"

export const UserPointsQuery = gql`
  query UserPoints {
    currentUser {
      ...UserPointsFragment
    }
  }
  ${PointsListItemCard.fragments.user}
`
