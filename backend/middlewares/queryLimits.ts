import {
  GraphQLError,
  Kind,
  type SelectionSetNode,
  type ValidationContext,
  type ValidationRule,
} from "graphql"

/**
 * Deepest field nesting an operation may have, `__typename` aside. The standard
 * introspection query (`getIntrospectionQuery()`) is exactly this deep, and the
 * deepest frontend operation (StudentProgresses) is 11.
 */
export const MAX_QUERY_DEPTH = 15
/** Most aliased fields an operation may contain; frontend operations use at most 1. */
export const MAX_QUERY_ALIASES = 15

interface SelectionStats {
  depth: number
  aliases: number
}

const measureSelectionSet = (
  context: ValidationContext,
  selectionSet: SelectionSetNode,
  visitedFragments: ReadonlySet<string>,
  fragmentStats: Map<string, SelectionStats>,
): SelectionStats => {
  const stats: SelectionStats = { depth: 0, aliases: 0 }

  for (const selection of selectionSet.selections) {
    let childStats: SelectionStats
    let ownDepth = 0

    if (selection.kind === Kind.FIELD) {
      if (selection.name.value === "__typename") {
        continue
      }
      if (selection.alias) {
        stats.aliases++
      }
      ownDepth = 1
      childStats = selection.selectionSet
        ? measureSelectionSet(
            context,
            selection.selectionSet,
            visitedFragments,
            fragmentStats,
          )
        : { depth: 0, aliases: 0 }
    } else if (selection.kind === Kind.INLINE_FRAGMENT) {
      childStats = measureSelectionSet(
        context,
        selection.selectionSet,
        visitedFragments,
        fragmentStats,
      )
    } else {
      const fragmentName = selection.name.value
      const fragment = context.getFragment(fragmentName)
      // Unknown and cyclic fragments are reported by the standard rules.
      if (!fragment || visitedFragments.has(fragmentName)) {
        continue
      }
      // Memoized so that fragments spreading each other repeatedly can't make
      // this check itself exponential.
      const cachedStats = fragmentStats.get(fragmentName)
      if (cachedStats) {
        childStats = cachedStats
      } else {
        childStats = measureSelectionSet(
          context,
          fragment.selectionSet,
          new Set([...visitedFragments, fragmentName]),
          fragmentStats,
        )
        fragmentStats.set(fragmentName, childStats)
      }
    }

    stats.depth = Math.max(stats.depth, ownDepth + childStats.depth)
    stats.aliases += childStats.aliases
  }

  return stats
}

/**
 * Builds a validation rule rejecting operations whose field nesting (with
 * fragments inlined, `__typename` ignored) exceeds `maxDepth`, or that contain
 * more than `maxAliases` aliased fields.
 */
export const createQueryLimitsRule =
  ({
    maxDepth = MAX_QUERY_DEPTH,
    maxAliases = MAX_QUERY_ALIASES,
  } = {}): ValidationRule =>
  (context) => ({
    OperationDefinition(operation) {
      const { depth, aliases } = measureSelectionSet(
        context,
        operation.selectionSet,
        new Set(),
        new Map(),
      )

      if (depth > maxDepth) {
        context.reportError(
          new GraphQLError(
            `Query depth ${depth} exceeds the maximum of ${maxDepth}`,
            { nodes: operation },
          ),
        )
      }
      if (aliases > maxAliases) {
        context.reportError(
          new GraphQLError(
            `Query uses ${aliases} aliases, exceeding the maximum of ${maxAliases}`,
            { nodes: operation },
          ),
        )
      }
    },
  })
