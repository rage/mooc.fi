export function ParseLanguageFromUrl() {
  const path = window.location.pathname
  console.log(path)
}

/*function parseLanguageFromUrl(){
    const path = Window.document.location.pathname
    let language = "fi"
    if(path.startsWith("/en/")){
      language = 'en'
    }
    if(path.startsWith("/se/")){
      language = 'se'
    }
    return language
  }*/
