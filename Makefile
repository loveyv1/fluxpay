.PHONY: test build-engine build-platform lint deploy setup ops clean help

# ─── Default target ───────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  FluxSwap — Unified Build System"
	@echo ""
	@echo "  Usage: make <target>"
	@echo ""
	@echo "  Core Targets:"
	@echo "    test             Run all Soroban engine tests"
	@echo "    build-engine     Compile Rust contracts to WASM"
	@echo "    build-platform   Production Next.js bundle"
	@echo "    lint             Check engine and platform standards"
	@echo "    deploy           Testnet protocol deployment"
	@echo "    setup            Asset trustline configuration"
	@echo "    ops              Full CI/CD pipeline validation"
	@echo "    clean            Purge all build artifacts"
	@echo ""

# ─── Soroban Engine ───────────────────────────────────────────────────────────
test:
	cd engine && cargo test --all -- --nocapture

build-engine:
	cd engine/rex-token && cargo build --target wasm32-unknown-unknown --release
	cd engine/liquidity-pool && cargo build --target wasm32-unknown-unknown --release
	cd engine/bridge && cargo build --target wasm32-unknown-unknown --release
	@echo "✓ Compiled WASM modules available in engine/target/"

lint-engine:
	cd engine && cargo fmt --all -- --check
	cd engine && cargo clippy --target wasm32-unknown-unknown -- -D warnings

# ─── Web Platform ─────────────────────────────────────────────────────────────
build-platform:
	cd platform && npm run build

lint-platform:
	cd platform && npm run lint
	cd platform && npx tsc --noEmit

# ─── Unified ──────────────────────────────────────────────────────────────────
lint: lint-engine lint-platform

# ─── Operations ───────────────────────────────────────────────────────────────
deploy:
	node ops/deploy.js

setup:
	node ops/setup-trustlines.js

# ─── Lifecycle ────────────────────────────────────────────────────────────────
ops: lint test build-engine build-platform
	@echo ""
	@echo "✓ All protocol systems validated"
	@echo ""

# ─── Cleanup ──────────────────────────────────────────────────────────────────
clean:
	cd engine && cargo clean
	cd platform && rm -rf .next out node_modules/.cache
	@echo "✓ Environment reset complete"
