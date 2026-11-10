{
  description = "Development shell for mooc.fi";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        lib = pkgs.lib;

        # Must match packageManager in package.json; nixpkgs lags behind.
        pnpmVersion = "12.17.0";
        pnpmPlatforms = {
          x86_64-linux = { name = "linux-x64"; sha256 = "1m69jc8dmc8i2aj6vj27bnnx2gskjhd6vpw8fj7msxl21z87273c"; };
          aarch64-linux = { name = "linux-arm64"; sha256 = "0l2x24j4163s3c8pyf6xq28sf105216dkxc29pimbaf3m9j04zh1"; };
          x86_64-darwin = { name = "darwin-x64"; sha256 = "00gzhlh62ik76cs7pzlq58vf3iwk3snw7s5ln18synxcjbkil7d5"; };
          aarch64-darwin = { name = "darwin-arm64"; sha256 = "0wm5n2pfqwlw5l6czm58j5y210bjfszdcy5ckzyajjgrjxvir4kz"; };
        };
        pnpm = pkgs.stdenv.mkDerivation {
          pname = "pnpm";
          version = pnpmVersion;
          src = pkgs.fetchurl (
            let platform = pnpmPlatforms.${system}; in
            {
              url = "https://registry.npmjs.org/@pnpm/exe.${platform.name}/-/exe.${platform.name}-${pnpmVersion}.tgz";
              inherit (platform) sha256;
            }
          );
          nativeBuildInputs = [ pkgs.makeWrapper ] ++ lib.optional pkgs.stdenv.hostPlatform.isLinux pkgs.autoPatchelfHook;
          buildInputs = lib.optional pkgs.stdenv.hostPlatform.isLinux pkgs.stdenv.cc.cc.lib;
          installPhase = ''
            runHook preInstall
            install -Dm755 pnpm "$out/bin/pnpm"
            ln -s "$out/bin/pnpm" "$out/bin/pn"
            makeWrapper "$out/bin/pnpm" "$out/bin/pnpx" --add-flag dlx
            runHook postInstall
          '';
          meta.mainProgram = "pnpm";
        };

        mkPackageManagerStub =
          name: hint:
          pkgs.writeShellScriptBin name ''
            echo "error: ${name} is not used in this project." >&2
            echo "Use pnpm instead. ${hint}" >&2
            exit 1
          '';

        mkRemovedToolStub =
          name: replacement: hint:
          pkgs.writeShellScriptBin name ''
            echo "error: ${name} was removed from this project; use ${replacement} instead." >&2
            echo "${hint}" >&2
            exit 1
          '';

        commandStubs = [
          (mkPackageManagerStub "npm" "Example: pnpm install, pnpm run <script>.")
          (mkPackageManagerStub "npx" "Example: pnpm exec <pkg>, or pnpm dlx <pkg>.")
          (mkPackageManagerStub "yarn" "Example: pnpm install, pnpm run <script>.")
          (mkRemovedToolStub "eslint" "oxlint" "Run: pnpm run lint (autofix) or pnpm run lint:ci (check only).")
          (mkRemovedToolStub "prettier" "oxfmt" "Run: pnpm run format (write) or pnpm run format:check (check only).")
        ];

        # Ahead of the user's PATH so a host node (nvm) or a host-profile g++ cannot pair with the
        # other side's glibc/libstdc++: native addons (node-rdkafka) built by one and loaded by the
        # other fail with "GLIBCXX_… not found". For the same reason devEngines.runtime in
        # package.json uses onFail "error": a pnpm-downloaded node would shadow this one in scripts.
        pathPriorityPackages = commandStubs ++ [
          pkgs.nodejs_26
          pkgs.stdenv.cc
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          packages = pathPriorityPackages ++ [
            pnpm
            pkgs.git
            pkgs.gnumake
            pkgs.jq
            pkgs.kubectl
            pkgs.kubernetes-helm
            pkgs.openssl
            pkgs.pkg-config
            pkgs.postgresql
            pkgs.python3
            pkgs.redis
            pkgs.zlib
            pkgs.zstd
          ];

          shellHook = ''
            export PATH="${lib.makeBinPath pathPriorityPackages}:$PATH"
          '';
        };
      }
    );
}
