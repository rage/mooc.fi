import { useMemo } from "react"

import { useFormState } from "react-hook-form"
import { isString } from "remeda"

import BuildIcon from "@mui/icons-material/Build"
import InfoIcon from "@mui/icons-material/Info"
import TuneIcon from "@mui/icons-material/Tune"
import { Tab, TabProps, Tabs } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { useEditorContext, useEditorMethods } from "../EditorContext"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"
import { convertDotNotation } from "/util/convertDotNotation"
import flattenKeys from "/util/flattenKeys"
import { isDefinedAndNotEmpty } from "/util/guards"

const TabTitle = styled("span", {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>(
  ({ theme, error }) =>
    error && {
      color: theme.palette.error.main,
      "&:after": {
        content: '"*"',
        color: theme.palette.error.main,
        marginLeft: theme.spacing(0.5),
      },
    },
)

interface TabWithErrorProps extends TabProps {
  error?: boolean
  errorTitle?: string
  active?: boolean
  showErrorOnActive?: boolean
}

const TabWithError = ({
  error,
  errorTitle,
  active,
  showErrorOnActive = false,
  ...props
}: TabWithErrorProps) => {
  let title = props.title

  if (!title && isString(props.label)) {
    title = props.label
  }
  if (error && errorTitle) {
    if (title) {
      title += " "
    }
    title += `${errorTitle}`
  }

  return (
    <Tab
      {...props}
      label={
        <TabTitle error={error && (!active || showErrorOnActive)}>
          {props.label}
        </TabTitle>
      }
      title={title}
      id={`editor-tab-${props.value}`}
      aria-controls={`editor-tabpanel-${props.value}`}
    />
  )
}

function CourseEditorTabs() {
  const t = useTranslator(CoursesTranslations)

  const { tab: currentTab, anchors } = useEditorContext()
  const { setTab } = useEditorMethods()
  const { errors } = useFormState()

  const tabs = useMemo(
    () => [
      {
        value: 0,
        label: t("tabCourseInfo"),
        title: t("tabCourseInfoTitle"),
        icon: <InfoIcon />,
      },
      {
        value: 1,
        label: t("tabCourseSettings"),
        title: t("tabCourseSettingsTitle"),
        icon: <TuneIcon />,
      },
      {
        value: 2,
        label: t("tabCourseAdvanced"),
        title: t("tabCourseAdvancedTitle"),
        icon: <BuildIcon />,
      },
    ],
    [t],
  )
  const errorTabs = useMemo(() => {
    const flattenedErrors = flattenKeys(errors)
    const errorAnchorTabs = Object.values(anchors)
      .filter((anchor) =>
        Object.keys(flattenedErrors).includes(convertDotNotation(anchor.name)),
      )
      .map((anchor) => anchor.tab)
      .filter(isDefinedAndNotEmpty)

    return errorAnchorTabs.reduce(
      (acc, curr) => {
        if (acc[curr]) {
          return acc
        }

        acc[curr] = true

        return acc
      },
      {} as Record<number, boolean>,
    )
  }, [errors, anchors])

  const onChangeTab = useEventCallback((_: any, newTab: any) => setTab(newTab))

  return (
    <Tabs
      key="tabs"
      variant="fullWidth"
      value={currentTab}
      onChange={onChangeTab}
    >
      {tabs.map((tab) => (
        <TabWithError
          key={tab.value}
          {...tab}
          active={tab.value === currentTab}
          error={errorTabs[tab.value]}
          errorTitle={t("tabHasErrors")}
        />
      ))}
    </Tabs>
  )
}

export default CourseEditorTabs
