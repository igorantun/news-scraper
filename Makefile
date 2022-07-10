#!make
include .env
export

news-scraper:
	@docker-compose up news-scraper

news-scraper-dev:
	@docker-compose up news-scraper-dev

cleanup:
	rm -rf reports

stop:
	@docker-compose stop
