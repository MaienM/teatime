-- {{{ Clear things, the nuclear way
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
ALTER SCHEMA public OWNER TO postgres;
-- }}}

-- {{{ Enable needed extensions
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
CREATE EXTENSION pgcrypto WITH SCHEMA public;
CREATE EXTENSION pg_trgm WITH SCHEMA public;
-- }}}

-- {{{ Brands
CREATE TABLE brands(
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	url VARCHAR(255),
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),

	PRIMARY KEY(uuid),
	UNIQUE(name),
	CHECK(name <> '')
);
CREATE INDEX brands_name_idx ON brands USING gist(name gist_trgm_ops);
COMMENT ON TABLE brands IS 'The brands of tea';
COMMENT ON COLUMN brands.uuid IS 'The unique identifier of the brand';
COMMENT ON COLUMN brands.name IS 'The name of the brand';
COMMENT ON COLUMN brands.url IS 'The url of the website of the brand, if any';
COMMENT ON COLUMN brands.created_at IS 'When the brand was added to the database';
COMMENT ON COLUMN brands.updated_at IS 'When the brand was last modified in the database';
-- }}}

-- {{{ Categories
CREATE TABLE categories(
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),

	PRIMARY KEY(uuid),
	UNIQUE(name),
	CHECK(name <> '')
);
CREATE INDEX categories_name_idx ON categories USING gist(name gist_trgm_ops);
COMMENT ON TABLE categories IS 'The categories of tea';
COMMENT ON COLUMN categories.uuid IS 'The unique identifier of the category';
COMMENT ON COLUMN categories.name IS 'The name of the category';
COMMENT ON COLUMN categories.created_at IS 'When the category was added to the database';
COMMENT ON COLUMN categories.updated_at IS 'When the category was last modified in the database';
--}}}

-- {{{ Teas
CREATE TABLE teas(
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	brand_uuid UUID NOT NULL REFERENCES brands(uuid),
	category_uuid UUID NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),

	PRIMARY KEY(uuid),
	FOREIGN KEY(brand_uuid) REFERENCES brands(uuid),
	FOREIGN KEY(category_uuid) REFERENCES categories(uuid),
	UNIQUE(name, brand_uuid),
	CHECK(name <> '')
);
CREATE INDEX teas_name_idx ON teas USING gist(name gist_trgm_ops);
COMMENT ON TABLE teas IS 'The teas';
COMMENT ON COLUMN teas.uuid IS 'The unique identifier of the tea';
COMMENT ON COLUMN teas.name IS 'The name of the tea';
COMMENT ON COLUMN teas.brand_uuid IS 'The unique identifier of the brand of the tea';
COMMENT ON COLUMN teas.category_uuid IS 'The unique identifier of the category of the tea';
COMMENT ON COLUMN teas.created_at IS 'When the tea was added to the database';
COMMENT ON COLUMN teas.updated_at IS 'When the tea was last modified in the database';
-- }}}

-- {{{ Prices
CREATE TABLE prices(
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	price NUMERIC(6,2) NOT NULL,
	amount INTEGER NOT NULL,
	tea_uuid UUID NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),

	PRIMARY KEY(uuid),
	FOREIGN KEY(tea_uuid) REFERENCES teas(uuid),
	UNIQUE(amount, tea_uuid),
	CHECK(price >= 0),
	CHECK(amount > 0)
);
COMMENT ON TABLE prices IS 'The prices of the teas';
COMMENT ON COLUMN prices.uuid IS 'The unique identifier of the price';
COMMENT ON COLUMN prices.price IS 'The price, in euro';
COMMENT ON COLUMN prices.amount IS 'The amount of tea you get for this price, in grams';
COMMENT ON COLUMN prices.tea_uuid IS 'The unique identifier of the tea that this price is for';
COMMENT ON COLUMN prices.created_at IS 'When the price was added to the database';
COMMENT ON COLUMN prices.updated_at IS 'When the price was last modified in the database';
-- }}}

-- {{{ Steep advices
CREATE TABLE steep_advices(
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	description TEXT,
	amount NUMRANGE NOT NULL,
	duration INT4RANGE NOT NULL,
	temperature INT4RANGE NOT NULL,
	tea_uuid UUID NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),

	PRIMARY KEY(uuid),
	FOREIGN KEY(tea_uuid) REFERENCES teas(uuid),
	UNIQUE(name, tea_uuid),
	CHECK(name <> ''),
	CHECK(description <> ''),
	CHECK(lower(amount) > 0),
	CHECK(lower(duration) > 0),
	CHECK(lower(temperature) > 0)
);
COMMENT ON TABLE steep_advices IS 'The steep advices of the teas';
COMMENT ON COLUMN steep_advices.uuid IS 'The unique identifier of the steep advice';
COMMENT ON COLUMN steep_advices.name IS 'The name of the steep advice';
COMMENT ON COLUMN steep_advices.description IS 'The detailed description of the steep advice, if applicable';
COMMENT ON COLUMN steep_advices.amount IS 'The advised amount of tea, in grams';
COMMENT ON COLUMN steep_advices.duration IS 'The advised steeping duration, in seconds';
COMMENT ON COLUMN steep_advices.temperature IS 'The advised temperature, in celcius';
COMMENT ON COLUMN steep_advices.tea_uuid IS 'The unique identifier of the tea that this steep advice is for';
COMMENT ON COLUMN steep_advices.created_at IS 'When the steep advice was added to the database';
COMMENT ON COLUMN steep_advices.updated_at IS 'When the steep advice was last modified in the database';
-- }}}

-- {{{ Labels
CREATE TABLE labels(
	uuid UUID NOT NULL DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	xml XML NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),

	PRIMARY KEY(uuid),
	UNIQUE(name)
);
COMMENT ON TABLE labels IS 'The label templates';
COMMENT ON COLUMN labels.uuid IS 'The unique identifier of the label template';
COMMENT ON COLUMN labels.name IS 'The name of the label template';
COMMENT ON COLUMN labels.xml IS 'The XML template';
COMMENT ON COLUMN labels.created_at IS 'When the label template was added to the database';
COMMENT ON COLUMN labels.updated_at IS 'When the label template was last modified in the database';
-- }}}

-- {{{ Autocomplete functions
CREATE FUNCTION get_brands_for_autocomplete(search varchar)
RETURNS SETOF brands AS $$
	SELECT *
	FROM brands
	ORDER BY similarity(name, search) DESC, name ASC;
$$ LANGUAGE SQL STABLE;
COMMENT ON FUNCTION get_brands_for_autocomplete(varchar) IS
	'Get the brands for the autocompletion, based on the search term.'
	'This doesn''t filter out values, but rather orders them from most to least likely.';

CREATE FUNCTION get_categories_for_autocomplete(search varchar)
RETURNS SETOF categories AS $$
	SELECT *
	FROM categories
	ORDER BY similarity(name, search) DESC, name ASC;
$$ LANGUAGE SQL STABLE;
COMMENT ON FUNCTION get_categories_for_autocomplete(varchar) IS
	'Get the categories for the autocompletion, based on the search term. '
	'This doesn''t filter out values, but rather orders them from most to least likely.';
-- }}}

-- {{{ Triggers to auto-set updated_at
CREATE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_updated_at BEFORE UPDATE ON brands
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON categories
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_tea_updated_at BEFORE UPDATE ON teas
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_price_updated_at BEFORE UPDATE ON prices
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_steep_advice_updated_at BEFORE UPDATE ON steep_advices
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_label_updated_at BEFORE UPDATE ON labels
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
-- }}}

-- {{{ Setup watch fixtures
\i ../node_modules/postgraphql/resources/watch-fixtures.sql
-- }}}

-- {{{ Create a limited role for the teatime user
-- This role will be able to CRUD the tables
-- This role will not be able to modify uuid, created_at and updated_at fields
-- This role will not have access to functions other than the ones specifically created for it
DROP ROLE IF EXISTS application;
CREATE ROLE application;
GRANT USAGE ON SCHEMA public TO application;
GRANT
	SELECT,
	INSERT(name, url),
	UPDATE(name, url),
	DELETE
ON TABLE brands TO application;
GRANT
	SELECT,
	INSERT(name),
	UPDATE(name),
	DELETE
ON TABLE categories TO application;
GRANT
	SELECT,
	INSERT(name, brand_uuid, category_uuid),
	UPDATE(name, brand_uuid, category_uuid),
	DELETE
ON TABLE teas TO application;
GRANT
	SELECT,
	INSERT(price, amount, tea_uuid),
	UPDATE(price, amount, tea_uuid),
	DELETE
ON TABLE prices TO application;
GRANT
	SELECT,
	INSERT(name, description, amount, duration, temperature, tea_uuid),
	UPDATE(name, description, amount, duration, temperature, tea_uuid),
	DELETE
ON TABLE steep_advices TO application;
GRANT EXECUTE ON FUNCTION get_brands_for_autocomplete(varchar) TO application;
GRANT EXECUTE ON FUNCTION get_categories_for_autocomplete(varchar) TO application;
-- }}}

/* CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public; */
