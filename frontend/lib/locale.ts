import { type MRT_Localization } from "material-react-table"

import { Localization } from "@mui/material/locale"
import { type PickersLocaleText } from "@mui/x-date-pickers/locales"

// https://github.com/mui/material-ui/blob/master/packages/mui-material/src/locale/index.ts
export const fiFI: Localization = {
  components: {
    MuiBreadcrumbs: {
      defaultProps: {
        expandText: "Näytä reitti",
      },
    },
    MuiTablePagination: {
      defaultProps: {
        getItemAriaLabel: (type) => {
          if (type === "first") {
            return "Mene ensimmäiselle sivulle"
          }
          if (type === "last") {
            return "Mene viimeiselle sivulle"
          }
          if (type === "next") {
            return "Mene seuraavalle sivulle"
          }
          // if (type === 'previous') {
          return "Mene edelliselle sivulle"
        },
        labelRowsPerPage: "Rivejä per sivu:",
        labelDisplayedRows: ({ from, to, count }) =>
          `${from}–${to} / ${count !== -1 ? count : `enemmän kuin ${to}`}`,
      },
    },
    MuiRating: {
      defaultProps: {
        getLabelText: (value) => `${value} täht${value !== 1 ? "eä" : "i"}`,
        emptyLabelText: "Tyhjä",
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        clearText: "Tyhjennä",
        closeText: "Sulje",
        loadingText: "Ladataan…",
        noOptionsText: "Ei valintoja",
        openText: "Avaa",
      },
    },
    MuiAlert: {
      defaultProps: {
        closeText: "Sulje",
      },
    },
    MuiPagination: {
      defaultProps: {
        "aria-label": "Sivutusnavigaatio",
        getItemAriaLabel: (type, page, selected) => {
          if (type === "page") {
            return `${selected ? "sivu" : "Siirry sivulle"} ${page}`
          }
          if (type === "first") {
            return "Siirry ensimmäiselle sivulle"
          }
          if (type === "last") {
            return "Siirry viimeiselle sivulle"
          }
          if (type === "next") {
            return "Siirry seuraavalle sivulle"
          }
          // if (type === 'previous') {
          return "Siirry edelliselle sivulle"
        },
      },
    },
  },
}

const views = {
  hours: "tunnit",
  minutes: "minuutit",
  seconds: "sekunnit",
}

// https://github.com/mui/mui-x/blob/master/packages/x-date-pickers/src/locales/fiFI.ts
const fiFIPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: "Edellinen kuukausi",
  nextMonth: "Seuraava kuukausi",

  // View navigation
  openPreviousView: "avaa edellinen kuukausi",
  openNextView: "avaa seuraava kuukausi",
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === "year"
      ? "vuosinäkymä on auki, vaihda kalenterinäkymään"
      : "kalenterinäkymä on auki, vaihda vuosinäkymään",

  // DateRange placeholders
  start: "Alku",
  end: "Loppu",

  // Action bar
  cancelButtonLabel: "Peruuta",
  clearButtonLabel: "Tyhjennä",
  okButtonLabel: "OK",
  todayButtonLabel: "Tänään",

  // Toolbar titles
  datePickerToolbarTitle: "Valitse päivä",
  dateTimePickerToolbarTitle: "Valitse päivä ja aika",
  timePickerToolbarTitle: "Valitse aika",
  dateRangePickerToolbarTitle: "Valitse aikaväli",

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Valitse ${views[view]}. ${
      time === null
        ? "Ei aikaa valittuna"
        : `Valittu aika on ${adapter.format(time, "fullTime")}`
    }`,
  hoursClockNumberText: (hours) => `${hours} tuntia`,
  minutesClockNumberText: (minutes) => `${minutes} minuuttia`,
  secondsClockNumberText: (seconds) => `${seconds} sekuntia`,

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Valitse päivä, valittu päivä on ${utils.format(value, "fullDate")}`
      : "Valitse päivä",
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Valitse aika, valittu aika on ${utils.format(value, "fullTime")}`
      : "Valitse aika",

  // Table labels
  timeTableLabel: "valitse aika",
  dateTableLabel: "valitse päivä",

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
}

const getPickersLocalization = (
  pickersTranslations: Partial<PickersLocaleText<any>>,
) => {
  return {
    components: {
      MuiLocalizationProvider: {
        defaultProps: {
          localeText: { ...pickersTranslations },
        },
      },
    },
  }
}

export const datePickersfiFI = getPickersLocalization(fiFIPickers)

export const MRT_Localization_FI: MRT_Localization = {
  actions: "Toiminnot",
  and: "ja",
  cancel: "Peruuta",
  changeFilterMode: "Muuta suodattimen tilaa",
  changeSearchMode: "Muuta hakutapaa",
  clearFilter: "Tyhjennä suodatin",
  clearSearch: "Tyhjennä haku",
  clearSort: "Tyhjennä lajittelu",
  clickToCopy: "Kopioi napsauttamalla",
  collapse: "Supista",
  collapseAll: "Supista kaikki",
  columnActions: "Saraketoiminnot",
  copiedToClipboard: "Kopioitu leikepöydälle",
  dropToGroupBy: "Pudota tähän ryhmitelläksesi sarakkeen {column} mukaan",
  edit: "Muokkaa",
  expand: "Laajenna",
  expandAll: "Laajenna kaikki",
  filterArrIncludes: "Sisältää",
  filterArrIncludesAll: "Sisältää kaikki",
  filterArrIncludesSome: "Sisältää",
  filterBetween: "Välillä",
  filterBetweenInclusive: "Välillä mukaan lukien",
  filterByColumn: "Suodata sarakkeen {column} mukaan",
  filterContains: "Sisältää",
  filterEmpty: "Tyhjä",
  filterEndsWith: "Loppuu",
  filterEquals: "On yhtä kuin",
  filterEqualsString: "On yhtä kuin",
  filterFuzzy: "Sumea",
  filterGreaterThan: "Enemmän kuin",
  filterGreaterThanOrEqualTo: "Enemmän tai yhtä paljon kuin",
  filterInNumberRange: "Välillä",
  filterIncludesString: "Sisältää",
  filterIncludesStringSensitive: "Sisältää",
  filterLessThan: "Vähemmän kuin",
  filterLessThanOrEqualTo: "Vähemmän tai yhtä paljon kuin",
  filterMode: "Suodattimen tila: {filterType}",
  filterNotEmpty: "Ei tyhjä",
  filterNotEquals: "Ei ole yhtä kuin",
  filterStartsWith: "Alkaa",
  filterWeakEquals: "On yhtä kuin",
  filteringByColumn:
    "Suodatetaan sarakkeen {column} mukaan - {filterType} {filterValue}",
  goToFirstPage: "Siirry ensimmäiselle sivulle",
  goToLastPage: "Siirry viimeiselle sivulle",
  goToNextPage: "Siirry seuraavalle sivulle",
  goToPreviousPage: "Siirry edelliselle sivulle",
  grab: "Nappaa",
  groupByColumn: "Ryhmittele sarakkeen {column} mukaan",
  groupedBy: "Ryhmitelty sarakkeella ",
  hideAll: "Piilota kaikki",
  hideColumn: "Piilota sarake {column}",
  max: "Maksimi",
  min: "Minimi",
  move: "Siirrä",
  noRecordsToDisplay: "Ei näytettäviä tietueita",
  noResultsFound: "Ei tuloksia",
  of: "/",
  or: "tai",
  pinToLeft: "Kiinnitä vasemmalle",
  pinToRight: "Kiinnitä oikealle",
  resetColumnSize: "Nollaa sarakkeen koko",
  resetOrder: "Nollaa järjestys",
  rowActions: "Rivitoiminnot",
  rowNumber: "#",
  rowNumbers: "Rivinumerot",
  rowsPerPage: "Rivejä per sivu",
  save: "Tallenna",
  search: "Etsi",
  selectedCountOfRowCountRowsSelected:
    "{selectedCount}/{rowCount} rivi(ä) valittu",
  select: "Valitse",
  showAll: "Näytä kaikki",
  showAllColumns: "Näytä kaikki sarakkeet",
  showHideColumns: "Näytä/piilota sarakkeita",
  showHideFilters: "Näytä/piilota suodattimet",
  showHideSearch: "Näytä/piilota haku",
  sortByColumnAsc: "Järjestä sarakkeen {column} mukaan nousevasti",
  sortByColumnDesc: "Järjestä sarakkeen {column} mukaan laskevasti",
  sortedByColumnAsc: "Järjestetty sarakkeen {column} mukaan nousevasti",
  sortedByColumnDesc: "Järjestetty sarakkeen {column} mukaan laskevasti",
  thenBy: ", sitten ",
  toggleDensity: "Vaihda tiheyttä",
  toggleFullScreen: "Vaihda kokoruututila",
  toggleSelectAll: "Vaihda valitse kaikki",
  toggleSelectRow: "Vaihda valitse rivi",
  toggleVisibility: "Vaihda näkyvyys",
  ungroupByColumn: "Poista ryhmittely sarakkeen {column} mukaan",
  unpin: "Poista kiinnitys",
  unpinAll: "Poista kiinnitys kaikilta",
  unsorted: "Järjestämätön",
}
