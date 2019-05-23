<<<<<<< HEAD
import * as React from "react";
import {  Typography } from '@material-ui/core'



function AdminError(){
    return (
      <section>
        <Typography 
          component='h1' 
          variant='h2' 
          gutterBottom={true}
          align='center'
          >
            Sorry...
        </Typography>
        <Typography 
          variant='body1' 
          gutterBottom={true}
          align='center'
          >
            Looks like you are trying to view an Admin only page. 
            If you think you should have access to this page, log in again using your admin details. 
        </Typography>
      </section>
        
    )
  }



export default AdminError
=======
import * as React from "react"
import { Typography } from "@material-ui/core"

function AdminError() {
  return (
    <section>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
      >
        Sorry...
      </Typography>
      <Typography variant="body1" gutterBottom={true} align="center">
        Looks like you are trying to view an Admin only page. If you think you
        should have access to this page, log in again using your admin details.
      </Typography>
    </section>
  )
}

export default AdminError
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
