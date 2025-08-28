.PHONY: dev migrate seed

# Starts the development environment
dev:
	@echo "Starting development environment..."
	@docker-compose -f infra/docker-compose.yml up --build

# Runs database migrations
migrate:
	@echo "Running database migrations..."
	@docker-compose -f infra/docker-compose.yml exec api alembic upgrade head

# Seeds the database with initial data
seed:
	@echo "Seeding the database..."
	@docker-compose -f infra/docker-compose.yml exec api python -m scripts.seed
