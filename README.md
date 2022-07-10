# 📰 News Scraper

## Description

This is an automated script that scrapes the websites of 5 major Brazilian newspapers (Estadão, Folha, g1, UOL and VEJA). It scrapes the homepage of each newspaper and extracts the news headlines, links, summary and more. It then exports the report data to HTML, JSON, PDF and/or image files.

## Getting started

### Prerequesites

- Docker
- Docker Compose

### Cloning and copying .env example

```sh
$ git clone git@github.com:igorantun/news-scraper.git
$ cd news-scraper
$ cp .env.example .env
```

#### Other requirements

You should also copy your Firebase `serviceAccountKey.json` file to the `src/config` folder.

## Make commands

```sh
$ make news-scraper # Starts production news scraper worker, with Logflare and Firebase integration enabled
$ make news-scraper-dev # Starts development news scraper worker, with nodemon
$ make clean # Deletes all generated files under ./reports
$ make stop # Stops all services
```

## License

Released under the MIT License. See the [LICENSE](LICENSE) file
for details.
