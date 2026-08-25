#!/usr/bin/env bash
# Generate the Apple "client secret" JWT that Supabase's Apple provider expects in its
# Secret Key field. Supabase does NOT accept the raw .p8 — it wants an ES256-signed JWT
# derived from it, which is why the dashboard warns that the secret expires every 6 months.
# Apple caps the lifetime at 6 months (15777000s), so this must be re-run before it expires.
#
# Usage: scripts/apple-client-secret.sh /path/to/AuthKey_XXXXXXXXXX.p8
#
# Values are read from the constants below; the Key ID comes from the .p8 filename.
set -euo pipefail

TEAM_ID="MHWR5UKD73"                          # Apple Developer Team ID
SERVICES_ID="com.outstandingpartner.app.web"  # the Services ID (NOT the app bundle id)
AUD="https://appleid.apple.com"
LIFETIME=15777000                             # 6 months — Apple's maximum

P8="${1:-}"
[ -f "$P8" ] || { echo "usage: $0 /path/to/AuthKey_XXXXXXXXXX.p8" >&2; exit 1; }

KEY_ID="$(basename "$P8" .p8 | sed 's/^AuthKey_//')"
IAT="$(date +%s)"
EXP=$((IAT + LIFETIME))

b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }

HEADER="$(printf '{"alg":"ES256","kid":"%s","typ":"JWT"}' "$KEY_ID" | b64url)"
PAYLOAD="$(printf '{"iss":"%s","iat":%s,"exp":%s,"aud":"%s","sub":"%s"}' \
  "$TEAM_ID" "$IAT" "$EXP" "$AUD" "$SERVICES_ID" | b64url)"

# ES256 needs a raw 64-byte r||s signature; openssl emits DER, so convert it.
SIG_DER="$(mktemp)"; trap 'rm -f "$SIG_DER"' EXIT
printf '%s.%s' "$HEADER" "$PAYLOAD" | openssl dgst -sha256 -sign "$P8" -out "$SIG_DER"

SIG="$(python3 - "$SIG_DER" <<'PY'
import sys, base64
der = open(sys.argv[1], 'rb').read()
# SEQUENCE { INTEGER r, INTEGER s } -> fixed-width 32-byte halves
i = 2 if der[1] < 0x80 else 3            # skip tag + (short|long) length
def take(i):
    assert der[i] == 0x02, 'expected INTEGER'
    n = der[i+1]
    v = der[i+2:i+2+n].lstrip(b'\x00')   # DER may prepend 0x00 for sign
    return v.rjust(32, b'\x00'), i+2+n
r, i = take(i)
s, _ = take(i)
print(base64.urlsafe_b64encode(r + s).decode().rstrip('='))
PY
)"

echo "${HEADER}.${PAYLOAD}.${SIG}"
