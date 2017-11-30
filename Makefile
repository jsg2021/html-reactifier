.PHONY:
	clean \
	check \
	test


ROOT_DIR = $(patsubst %/,%, $(dir $(abspath $(lastword $(MAKEFILE_LIST)))))

SRC = $(shell find src -name '*.js')
LIB = $(SRC:src/%.js=lib/%.js)
LIBDIR = lib
REPORTDIR = reports

all: node_modules check test lib

node_modules: package.json
	@rm -r $@
	@npm install
	@touch $@

check:
	@eslint --ext .js,.jsx ./src

test: node_modules check
	@jest

clean:
	@rm -rf $(LIBDIR)
	@rm -rf $(REPORTDIR)

lib: $(LIB)
lib/%.js: src/%.js
#	@echo babel	$@...
	@mkdir -p $(@D)
	babel $< -o $@
