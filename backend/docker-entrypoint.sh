#!/bin/bash
set -e

# Cache configuration, routes, views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Seed database if requested or if users table is empty
echo "Checking if database needs seeding..."
# We can run seeder directly or verify
php artisan db:seed --force || echo "Seeding skipped or already completed."

# Execute CMD
exec "$@"
