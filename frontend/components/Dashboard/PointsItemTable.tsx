import React from "react"
import { Table, TableRow, TableCell, TableBody } from "@material-ui/core"

function PointsItemTable() {
  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell align="right">1</TableCell>
          <TableCell align="right">11/12</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">2</TableCell>
          <TableCell align="right">7/10</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">3</TableCell>
          <TableCell align="right">6/10</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">4</TableCell>
          <TableCell align="right">6/10</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default PointsItemTable
