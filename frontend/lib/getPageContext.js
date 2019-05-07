import { SheetsRegistry } from "jss";
import {
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles";
import yellow from '@material-ui/core/colors/yellow';
import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';



// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
     main: yellow[500],
      
    },
    secondary: {
      main: indigo[500],
      
    },
    error: red,
    textPrimary: '#111',
    textSecondary: '#000'

  },
  typography: {
    useNextVariants: true,

  },
  spacing: 2,

});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  };
}

let pageContext;

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }

  return pageContext;
}
