.PHONY:
	clean \
	check \
	test \
	watch \
	watch-stop


ROOT_DIR = $(patsubst %/,%, $(dir $(abspath $(lastword $(MAKEFILE_LIST)))))

SRC = $(shell find src -name '*.js')
LIB = $(SRC:src/%.js=lib/%.js)
LIBDIR = lib

all: node_modules lib

node_modules: package.json
#	@rm -rf node_modules
#	@npm install
	@npm update
	@touch $@

check:
	@eslint --ext .js,.jsx ./src

test: node_modules check
	@karma start --single-run

clean:
	@rm -rf $(LIBDIR)

lib: $(LIB)
lib/%.js: src/%.js
#	@echo babel	$@...
	@mkdir -p $(@D)
	babel $< -o $@
