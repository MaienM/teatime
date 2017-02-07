--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.0
-- Dumped by pg_dump version 9.6.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: teatime
--

CREATE TABLE brands (
    uuid uuid NOT NULL,
    name character varying(255) NOT NULL,
    url character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE brands OWNER TO teatime;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: teatime
--

CREATE TABLE categories (
    uuid uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE categories OWNER TO teatime;

--
-- Name: prices; Type: TABLE; Schema: public; Owner: teatime
--

CREATE TABLE prices (
    uuid uuid NOT NULL,
    amount numeric(4,2) NOT NULL,
    weight integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    tea_uuid uuid NOT NULL
);


ALTER TABLE prices OWNER TO teatime;

--
-- Name: steep_advices; Type: TABLE; Schema: public; Owner: teatime
--

CREATE TABLE steep_advices (
    uuid uuid NOT NULL,
    amount numrange NOT NULL,
    "time" int4range NOT NULL,
    temperature int4range NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    tea_uuid uuid NOT NULL
);


ALTER TABLE steep_advices OWNER TO teatime;

--
-- Name: teas; Type: TABLE; Schema: public; Owner: teatime
--

CREATE TABLE teas (
    uuid uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    brand_uuid uuid NOT NULL,
    category_uuid uuid NOT NULL
);


ALTER TABLE teas OWNER TO teatime;

--
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (uuid);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (uuid);


--
-- Name: prices prices_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_pkey PRIMARY KEY (uuid);


--
-- Name: steep_advices steep_advices_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY steep_advices
    ADD CONSTRAINT steep_advices_pkey PRIMARY KEY (uuid);


--
-- Name: teas teas_name_brand_uuid_key; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_name_brand_uuid_key UNIQUE (name, brand_uuid);


--
-- Name: teas teas_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_pkey PRIMARY KEY (uuid);


--
-- Name: prices prices_tea_uuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_tea_uuid_fkey FOREIGN KEY (tea_uuid) REFERENCES teas(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: steep_advices steep_advices_tea_uuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY steep_advices
    ADD CONSTRAINT steep_advices_tea_uuid_fkey FOREIGN KEY (tea_uuid) REFERENCES teas(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teas teas_brand_uuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_brand_uuid_fkey FOREIGN KEY (brand_uuid) REFERENCES brands(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teas teas_category_uuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_category_uuid_fkey FOREIGN KEY (category_uuid) REFERENCES categories(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

