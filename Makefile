.PHONY: lint
lint: lint-js lint-go

.PHONY: lint-js
lint-js: 
	./js-lint.sh

.PHONY: lint-go
lint-go: 
	./go-lint.sh
