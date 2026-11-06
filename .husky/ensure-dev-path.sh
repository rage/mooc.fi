# Sourced by hooks: re-runs the calling hook inside `nix develop` when the Node.js on PATH is not
# the one devEngines.runtime pins, since pnpm refuses to run with any other version.

if [ -n "${MOOCFI_HUSKY_IN_NIX:-}" ]; then
  return 0 2>/dev/null || exit 0
fi

_husky_repo="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"

if node -e 'process.exit(process.version.slice(1) === require(process.argv[1]).devEngines.runtime.version ? 0 : 1)' "$_husky_repo/package.json" 2>/dev/null; then
  return 0 2>/dev/null || exit 0
fi

if ! command -v nix >/dev/null 2>&1; then
  for _nix_bin in "${HOME}/.nix-profile/bin" /nix/var/nix/profiles/default/bin; do
    if [ -x "$_nix_bin/nix" ]; then
      PATH="$_nix_bin:$PATH"
      break
    fi
  done
fi

if ! command -v nix >/dev/null 2>&1; then
  echo "husky: this repository needs the Node.js version in package.json devEngines (found $(node -v 2>/dev/null || echo none))."
  echo "Install it or run: nix develop"
  exit 1
fi

export MOOCFI_HUSKY_IN_NIX=1
exec nix develop "$_husky_repo" -c env MOOCFI_HUSKY_IN_NIX=1 sh -e "$0" "$@"
