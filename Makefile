# Nexus IDE Makefile
.PHONY: help build run test clean install dev release bench fmt lint

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
NC := \033[0m

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

##@ Development

build: ## Build debug version
	cargo build

release: ## Build optimized release
	cargo build --release

run: ## Run Nexus
	cargo run

dev: ## Run with hot reload
	cargo watch -x run

test: ## Run all tests
	cargo test

test-watch: ## Run tests with watch mode
	cargo watch -x test

bench: ## Run benchmarks
	cargo bench

##@ Code Quality

fmt: ## Format code
	cargo fmt

lint: ## Run clippy
	cargo clippy -- -D warnings

check: fmt lint test ## Run all checks

##@ Platform-Specific

build-mac: ## Build for macOS (Metal)
	cargo build --features metal --release

build-linux: ## Build for Linux (Vulkan)
	cargo build --features vulkan --release

build-windows: ## Build for Windows (DirectX)
	cargo build --features directx --release

##@ Plugins

plugin-new: ## Create new plugin (usage: make plugin-new NAME=myplugin)
	@mkdir -p plugins/$(NAME)
	@cargo init --lib plugins/$(NAME)
	@echo "Plugin $(NAME) created!"

plugin-build: ## Build all plugins
	@for dir in plugins/*; do \
		if [ -d "$$dir" ]; then \
			echo "Building $$dir..."; \
			cd $$dir && cargo build --release; cd ../..; \
		fi \
	done

##@ Utilities

clean: ## Clean build artifacts
	cargo clean
	rm -rf target

install: ## Install Nexus locally
	cargo install --path .

docs: ## Generate documentation
	cargo doc --no-deps --open

perf: ## Profile performance
	cargo flamegraph

size: ## Check binary size
	@du -h target/release/nexus

##@ Docker

docker-build: ## Build Docker image
	docker build -t nexus:latest .

docker-run: ## Run in Docker
	docker run -it nexus:latest
