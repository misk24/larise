#!/usr/bin/env bash
# Builds a throwaway database (Supabase stub + base schema + all migrations) and runs
# supabase/tests/*.sql against it. Usage: PGURL=postgres://user@host:port/postgres scripts/test-db.sh
set -euo pipefail
cd "$(dirname "$0")/.."
: "${PGURL:?set PGURL to a superuser connection string}"
DB="larise_test_$$"
psql "$PGURL" -v ON_ERROR_STOP=1 -qc "create database $DB"
trap 'psql "$PGURL" -qc "drop database if exists $DB" >/dev/null' EXIT
URL="${PGURL%/*}/$DB"
run() { psql "$URL" -v ON_ERROR_STOP=1 -q -f "$1"; }
psql "$URL" -v ON_ERROR_STOP=1 -qc "alter database $DB set search_path = \"\$user\", public, extensions"
run supabase/ci/00_supabase_stub.sql
run supabase/ci/01_base_schema.sql
for f in $(ls supabase/migrations/*.sql | sort); do echo "migration: $f"; run "$f"; done
run supabase/ci/02_prod_grants.sql
status=0
for t in supabase/tests/*.test.sql; do
  echo "test: $t"
  out=$(psql "$URL" -v ON_ERROR_STOP=1 -X -q -t -A -f "$t" 2>&1) || { echo "$out"; status=1; continue; }
  out=$(echo "$out" | sed 's/^psql:[^ ]* NOTICE:  //')
  echo "$out"
  if echo "$out" | grep -qE '^not ok|^# Looks like you failed'; then status=1; fi
done
exit $status
