.DEFAULT_GOAL := serve

include .env
export

lint:
	deno lint
fmt:
	deno fmt
serve:
	deno run --watch=. --allow-env --allow-net --allow-read main.ts

