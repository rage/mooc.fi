import React from "react"
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@material-ui/core"

function PointsItemTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell align="right">2</TableCell>
          <TableCell align="right">3</TableCell>
          <TableCell align="right">4</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>11/12</TableCell>
          <TableCell align="right">7/10</TableCell>
          <TableCell align="right">6/10</TableCell>
          <TableCell align="right">0/11</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default PointsItemTable
