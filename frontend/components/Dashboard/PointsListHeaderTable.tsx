import React from "react"
import { Table, TableRow, TableCell, TableBody } from "@material-ui/core"

function PointsListHeaderTable() {
  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell align="left">1</TableCell>
          <TableCell align="left">11/12</TableCell>
          <TableCell>
            <div
              style={{
                backgroundColor: "red",
                width: `${100 * (11 / 12)}%`,
              }}
            >
              total
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left">2</TableCell>
          <TableCell align="left">7/10</TableCell>
          <TableCell>
            <div
              style={{
                backgroundColor: "red",
                width: `${100 * (7 / 10)}%`,
              }}
            >
              total
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left">3</TableCell>
          <TableCell align="left">6/10</TableCell>
          <TableCell>
            <div
              style={{
                backgroundColor: "red",
                width: `${100 * (6 / 10)}%`,
              }}
            >
              total
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left">4</TableCell>
          <TableCell align="left">6/10</TableCell>
          <TableCell>
            <div
              style={{
                backgroundColor: "red",
                width: `${100 * (6 / 10)}%`,
              }}
            >
              total
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default PointsListHeaderTable
