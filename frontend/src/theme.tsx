import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
    palette: {
      primary: {
       main: yellow[500],
        
      },
      secondary: {
        main: indigo[500],
        
      },
      error: red,
     
  
    },
  
  });

export default theme;