{ pkgs }:
pkgs.mkShell {
  # Add build dependencies
  packages = with pkgs; [ nodejs ];

  # Add environment variables
  env = { };

  # Load custom bash code
  shellHook = ''

  '';
}
