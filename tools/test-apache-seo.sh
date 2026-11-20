#!/usr/bin/env bash
set -euo pipefail
root=$(mktemp -d)
pid=''
trap 'if [[ -n "$pid" ]]; then kill "$pid" 2>/dev/null || true; fi; rm -rf "$root"' EXIT
cat > "$root/httpd.conf" <<EOF
ServerRoot "$root"
PidFile "$root/server.pid"
ErrorLog "$root/error.log"
ServerName localhost
Listen 127.0.0.1:4189
LoadModule mpm_event_module /usr/lib/apache2/modules/mod_mpm_event.so
LoadModule authz_core_module /usr/lib/apache2/modules/mod_authz_core.so
LoadModule dir_module /usr/lib/apache2/modules/mod_dir.so
LoadModule alias_module /usr/lib/apache2/modules/mod_alias.so
LoadModule rewrite_module /usr/lib/apache2/modules/mod_rewrite.so
DocumentRoot "$PWD/dist"
DirectoryIndex index.html
<Directory "$PWD/dist">
  Options FollowSymLinks
  AllowOverride All
  Require all granted
</Directory>
EOF
/usr/sbin/apache2 -f "$root/httpd.conf" -DFOREGROUND &
pid=$!
for i in {1..30}; do
  if curl -fsS -o /dev/null http://127.0.0.1:4189/robots.txt; then break; fi
  sleep 0.2
done
python3 tools/test-seo.py http://127.0.0.1:4189 || { cat "$root/error.log"; exit 1; }
