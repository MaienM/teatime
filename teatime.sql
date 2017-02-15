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

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.teas DROP CONSTRAINT teas_category_uuid_fkey;
ALTER TABLE ONLY public.teas DROP CONSTRAINT teas_brand_uuid_fkey;
ALTER TABLE ONLY public.steep_advices DROP CONSTRAINT steep_advices_tea_uuid_fkey;
ALTER TABLE ONLY public.prices DROP CONSTRAINT prices_tea_uuid_fkey;
SET search_path = audit, pg_catalog;

DROP INDEX audit.logged_actions_relid_idx;
DROP INDEX audit.logged_actions_action_tstamp_tx_stm_idx;
DROP INDEX audit.logged_actions_action_idx;
SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.teas DROP CONSTRAINT teas_pkey;
ALTER TABLE ONLY public.teas DROP CONSTRAINT teas_pkeyu;
ALTER TABLE ONLY public.teas DROP CONSTRAINT teas_name_brand_uuid_key;
ALTER TABLE ONLY public.steep_advices DROP CONSTRAINT steep_advices_pkey;
ALTER TABLE ONLY public.steep_advices DROP CONSTRAINT steep_advices_pkeyu;
ALTER TABLE ONLY public.prices DROP CONSTRAINT prices_pkey;
ALTER TABLE ONLY public.prices DROP CONSTRAINT prices_pkeyu;
ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkeyu;
ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_name_key;
ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkeyu;
ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_name_key;
SET search_path = audit, pg_catalog;

ALTER TABLE ONLY audit.logged_relations DROP CONSTRAINT logged_relations_pkey;
ALTER TABLE ONLY audit.logged_actions DROP CONSTRAINT logged_actions_pkey;
SET search_path = public, pg_catalog;

SET search_path = audit, pg_catalog;

ALTER TABLE audit.logged_actions ALTER COLUMN event_id DROP DEFAULT;
SET search_path = public, pg_catalog;

DROP TABLE public.teas;
DROP TABLE public.steep_advices;
DROP TABLE public.prices;
DROP TABLE public.categories;
DROP TABLE public.brands;
SET search_path = audit, pg_catalog;

DROP TABLE audit.logged_relations;
DROP SEQUENCE audit.logged_actions_event_id_seq;
DROP TABLE audit.logged_actions;
DROP FUNCTION audit.replay_event(pevent_id integer);
DROP FUNCTION audit.if_modified_func();
DROP FUNCTION audit.audit_view(target_view regclass, audit_query_text boolean, ignored_cols text[], uid_cols text[]);
DROP FUNCTION audit.audit_view(target_view regclass, audit_query_text boolean, uid_cols text[]);
DROP FUNCTION audit.audit_view(target_view regclass, uid_cols text[]);
DROP FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]);
DROP FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean);
DROP FUNCTION audit.audit_table(target_table regclass);
DROP EXTENSION pgcrypto;
DROP EXTENSION hstore;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
DROP SCHEMA audit;
--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA audit;


ALTER SCHEMA audit OWNER TO postgres;

--
-- Name: SCHEMA audit; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA audit IS 'Out-of-table audit/history logging tables and trigger functions';


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = audit, pg_catalog;

--
-- Name: audit_table(regclass); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit_table(target_table regclass) RETURNS void
    LANGUAGE sql
    AS $_$
SELECT audit.audit_table($1, BOOLEAN 't', BOOLEAN 't');
$_$;


ALTER FUNCTION audit.audit_table(target_table regclass) OWNER TO postgres;

--
-- Name: FUNCTION audit_table(target_table regclass); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit_table(target_table regclass) IS '
Add auditing support to the given table. Row-level changes will be logged with full client query text. No cols are ignored.
';


--
-- Name: audit_table(regclass, boolean, boolean); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) RETURNS void
    LANGUAGE sql
    AS $_$
SELECT audit.audit_table($1, $2, $3, ARRAY[]::text[]);
$_$;


ALTER FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) OWNER TO postgres;

--
-- Name: audit_table(regclass, boolean, boolean, text[]); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  stm_targets text = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
  _q_txt text;
  _ignored_cols_snip text = '';
BEGIN

    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table::TEXT;
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table::TEXT;


    IF audit_rows THEN
        IF array_length(ignored_cols,1) > 0 THEN
            _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
        END IF;
        _q_txt = 'CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' || 
                 target_table::TEXT || 

                 ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
                 quote_literal(audit_query_text) || _ignored_cols_snip || ');';
        RAISE NOTICE '%',_q_txt;
        EXECUTE _q_txt;
        stm_targets = 'TRUNCATE';
    ELSE
    END IF;

    _q_txt = 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
             target_table ||
             ' FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('||
             quote_literal(audit_query_text) || ');';
    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;

    -- store primary key names
    insert into audit.logged_relations (relation_name, uid_column)
         select target_table, a.attname
           from pg_index i
           join pg_attribute a on a.attrelid = i.indrelid
                              and a.attnum = any(i.indkey)
          where i.indrelid = target_table::regclass
            and i.indisprimary
            ;
END;
$$;


ALTER FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) OWNER TO postgres;

--
-- Name: FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) IS '
Add auditing support to a table.

Arguments:
   target_table:     Table name, schema qualified if not on search_path
   audit_rows:       Record each row change, or only audit at a statement level
   audit_query_text: Record the text of the client query that triggered the audit event?
   ignored_cols:     Columns to exclude from update diffs, ignore updates that change only ignored cols.
';


--
-- Name: audit_view(regclass, text[]); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit_view(target_view regclass, uid_cols text[]) RETURNS void
    LANGUAGE sql
    AS $_$
SELECT audit.audit_view($1, BOOLEAN 't', uid_cols);
$_$;


ALTER FUNCTION audit.audit_view(target_view regclass, uid_cols text[]) OWNER TO postgres;

--
-- Name: audit_view(regclass, boolean, text[]); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit_view(target_view regclass, audit_query_text boolean, uid_cols text[]) RETURNS void
    LANGUAGE sql
    AS $_$
SELECT audit.audit_view($1, $2, ARRAY[]::text[], uid_cols);
$_$;


ALTER FUNCTION audit.audit_view(target_view regclass, audit_query_text boolean, uid_cols text[]) OWNER TO postgres;

--
-- Name: audit_view(regclass, boolean, text[], text[]); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit_view(target_view regclass, audit_query_text boolean, ignored_cols text[], uid_cols text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  stm_targets text = 'INSERT OR UPDATE OR DELETE';
  _q_txt text;
  _ignored_cols_snip text = '';

BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_view::text;
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_view::text;
 
	IF array_length(ignored_cols,1) > 0 THEN
	    _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
	END IF;
	_q_txt = 'CREATE TRIGGER audit_trigger_row INSTEAD OF INSERT OR UPDATE OR DELETE ON ' || 
		 target_view::TEXT || 
		 ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
		 quote_literal(audit_query_text) || _ignored_cols_snip || ');';
	RAISE NOTICE '%',_q_txt;
	EXECUTE _q_txt;

    -- store uid columns if not already present
  IF (select count(*) from audit.logged_relations where relation_name = (select target_view)::text AND  uid_column= (select unnest(uid_cols))::text) = 0 THEN
      insert into audit.logged_relations (relation_name, uid_column)
       select target_view, unnest(uid_cols);
  END IF;    

END;
$$;


ALTER FUNCTION audit.audit_view(target_view regclass, audit_query_text boolean, ignored_cols text[], uid_cols text[]) OWNER TO postgres;

--
-- Name: FUNCTION audit_view(target_view regclass, audit_query_text boolean, ignored_cols text[], uid_cols text[]); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION audit_view(target_view regclass, audit_query_text boolean, ignored_cols text[], uid_cols text[]) IS '
ADD auditing support TO a VIEW.
 
Arguments:
   target_view:      TABLE name, schema qualified IF NOT ON search_path
   audit_query_text: Record the text of the client query that triggered the audit event?
   ignored_cols:     COLUMNS TO exclude FROM UPDATE diffs, IGNORE updates that CHANGE only ignored cols.
   uid_cols:         COLUMNS to use to uniquely identify a row from the view (in order to replay UPDATE and DELETE)
';


--
-- Name: if_modified_func(); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION if_modified_func() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO pg_catalog, public
    AS $$
DECLARE
    audit_row audit.logged_actions;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    excluded_cols text[] = ARRAY[]::text[];
BEGIN
    --RAISE WARNING '[audit.if_modified_func] start with TG_ARGV[0]: % ; TG_ARGV[1] : %, TG_OP: %, TG_LEVEL : %, TG_WHEN: % ', TG_ARGV[0], TG_ARGV[1], TG_OP, TG_LEVEL, TG_WHEN;

    IF NOT (TG_WHEN IN ('AFTER' , 'INSTEAD OF')) THEN
        RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger';
    END IF;

    audit_row = ROW(
        nextval('audit.logged_actions_event_id_seq'), -- event_id
        TG_TABLE_SCHEMA::text,                        -- schema_name
        TG_TABLE_NAME::text,                          -- table_name
        TG_RELID,                                     -- relation OID for much quicker searches
        session_user::text,                           -- session_user_name
        current_timestamp,                            -- action_tstamp_tx
        statement_timestamp(),                        -- action_tstamp_stm
        clock_timestamp(),                            -- action_tstamp_clk
        txid_current(),                               -- transaction ID
        (SELECT setting FROM pg_settings WHERE name = 'application_name'),
        inet_client_addr(),                           -- client_addr
        inet_client_port(),                           -- client_port
        current_query(),                              -- top-level query or queries (if multistatement) from client
        substring(TG_OP,1,1),                         -- action
        NULL, NULL,                                   -- row_data, changed_fields
        'f'                                           -- statement_only
        );

    IF NOT TG_ARGV[0]::boolean IS DISTINCT FROM 'f'::boolean THEN
        audit_row.client_query = NULL;
        RAISE WARNING '[audit.if_modified_func] - Trigger func triggered with no client_query tracking';

    END IF;

    IF TG_ARGV[1] IS NOT NULL THEN
        excluded_cols = TG_ARGV[1]::text[];
        RAISE WARNING '[audit.if_modified_func] - Trigger func triggered with excluded_cols: %',TG_ARGV[1];
    END IF;
    
    IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
        h_old = hstore(OLD.*) - excluded_cols;
        audit_row.row_data = h_old;
        h_new = hstore(NEW.*)- excluded_cols;
        audit_row.changed_fields =  h_new - h_old;

        IF audit_row.changed_fields = hstore('') THEN
            -- All changed fields are ignored. Skip this update.
            RAISE WARNING '[audit.if_modified_func] - Trigger detected NULL hstore. ending';
            RETURN NULL;
        END IF;
  INSERT INTO audit.logged_actions VALUES (audit_row.*);
  RETURN NEW;
        
    ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(OLD.*) - excluded_cols;
  INSERT INTO audit.logged_actions VALUES (audit_row.*);
        RETURN OLD;
        
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(NEW.*) - excluded_cols;
  INSERT INTO audit.logged_actions VALUES (audit_row.*);
        RETURN NEW;

    ELSIF (TG_LEVEL = 'STATEMENT' AND TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN
        audit_row.statement_only = 't';
        INSERT INTO audit.logged_actions VALUES (audit_row.*);
  RETURN NULL;

    ELSE
        RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger for unhandled case: %, %',TG_OP, TG_LEVEL;
        RETURN NEW;
    END IF;


END;
$$;


ALTER FUNCTION audit.if_modified_func() OWNER TO postgres;

--
-- Name: FUNCTION if_modified_func(); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION if_modified_func() IS '
Track changes to a table at the statement and/or row level.

Optional parameters to trigger in CREATE TRIGGER call:

param 0: boolean, whether to log the query text. Default ''t''.

param 1: text[], columns to ignore in updates. Default [].

         Updates to ignored cols are omitted from changed_fields.

         Updates with only ignored cols changed are not inserted
         into the audit log.

         Almost all the processing work is still done for updates
         that ignored. If you need to save the load, you need to use
         WHEN clause on the trigger instead.

         No warning or error is issued if ignored_cols contains columns
         that do not exist in the target table. This lets you specify
         a standard set of ignored columns.

There is no parameter to disable logging of values. Add this trigger as
a ''FOR EACH STATEMENT'' rather than ''FOR EACH ROW'' trigger if you do not
want to log row values.

Note that the user name logged is the login role for the session. The audit trigger
cannot obtain the active role because it is reset by the SECURITY DEFINER invocation
of the audit trigger its self.
';


--
-- Name: replay_event(integer); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION replay_event(pevent_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  query text;
BEGIN
    with
    event as (
        select * from audit.logged_actions where event_id = pevent_id
    )
    -- get primary key names
    , where_pks as (
        select array_to_string(array_agg(uid_column || '=' || quote_literal(row_data->uid_column)), ' AND ') as where_clause
          from audit.logged_relations r
          join event on relation_name = (schema_name || '.' || table_name)
    )
    select into query
        case
            when action = 'I' then
                'INSERT INTO ' || schema_name || '.' || table_name ||
                ' ('||(select string_agg(key, ',') from each(row_data))||') VALUES ' ||
                '('||(select string_agg(case when value is null then 'null' else quote_literal(value) end, ',') from each(row_data))||')'
            when action = 'D' then
                'DELETE FROM ' || schema_name || '.' || table_name ||
                ' WHERE ' || where_clause
            when action = 'U' then
                'UPDATE ' || schema_name || '.' || table_name ||
                ' SET ' || (select string_agg(key || '=' || case when value is null then 'null' else quote_literal(value) end, ',') from each(changed_fields)) ||
                ' WHERE ' || where_clause
        end
    from
        event, where_pks
    ;
    
    execute query;
END;
$$;


ALTER FUNCTION audit.replay_event(pevent_id integer) OWNER TO postgres;

--
-- Name: FUNCTION replay_event(pevent_id integer); Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON FUNCTION replay_event(pevent_id integer) IS '
Replay a logged event.
 
Arguments:
   pevent_id:  The event_id of the event in audit.logged_actions to replay
';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: logged_actions; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE logged_actions (
    event_id bigint NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    relid oid NOT NULL,
    session_user_name text,
    action_tstamp_tx timestamp with time zone NOT NULL,
    action_tstamp_stm timestamp with time zone NOT NULL,
    action_tstamp_clk timestamp with time zone NOT NULL,
    transaction_id bigint,
    application_name text,
    client_addr inet,
    client_port integer,
    client_query text NOT NULL,
    action text NOT NULL,
    row_data public.hstore,
    changed_fields public.hstore,
    statement_only boolean NOT NULL,
    CONSTRAINT logged_actions_action_check CHECK ((action = ANY (ARRAY['I'::text, 'D'::text, 'U'::text, 'T'::text])))
);


ALTER TABLE logged_actions OWNER TO postgres;

--
-- Name: TABLE logged_actions; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON TABLE logged_actions IS 'History of auditable actions on audited tables, from audit.if_modified_func()';


--
-- Name: COLUMN logged_actions.event_id; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.event_id IS 'Unique identifier for each auditable event';


--
-- Name: COLUMN logged_actions.schema_name; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.schema_name IS 'Database schema audited table for this event is in';


--
-- Name: COLUMN logged_actions.table_name; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.table_name IS 'Non-schema-qualified table name of table event occured in';


--
-- Name: COLUMN logged_actions.relid; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.relid IS 'Table OID. Changes with drop/create. Get with ''tablename''::regclass';


--
-- Name: COLUMN logged_actions.session_user_name; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.session_user_name IS 'Login / session user whose statement caused the audited event';


--
-- Name: COLUMN logged_actions.action_tstamp_tx; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.action_tstamp_tx IS 'Transaction start timestamp for tx in which audited event occurred';


--
-- Name: COLUMN logged_actions.action_tstamp_stm; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.action_tstamp_stm IS 'Statement start timestamp for tx in which audited event occurred';


--
-- Name: COLUMN logged_actions.action_tstamp_clk; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.action_tstamp_clk IS 'Wall clock time at which audited event''s trigger call occurred';


--
-- Name: COLUMN logged_actions.transaction_id; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.transaction_id IS 'Identifier of transaction that made the change. May wrap, but unique paired with action_tstamp_tx.';


--
-- Name: COLUMN logged_actions.application_name; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.application_name IS 'Application name set when this audit event occurred. Can be changed in-session by client.';


--
-- Name: COLUMN logged_actions.client_addr; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.client_addr IS 'IP address of client that issued query. Null for unix domain socket.';


--
-- Name: COLUMN logged_actions.client_port; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.client_port IS 'Remote peer IP port address of client that issued query. Undefined for unix socket.';


--
-- Name: COLUMN logged_actions.client_query; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.client_query IS 'Top-level query that caused this auditable event. May be more than one statement.';


--
-- Name: COLUMN logged_actions.action; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.action IS 'Action type; I = insert, D = delete, U = update, T = truncate';


--
-- Name: COLUMN logged_actions.row_data; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.row_data IS 'Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.';


--
-- Name: COLUMN logged_actions.changed_fields; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.changed_fields IS 'New values of fields changed by UPDATE. Null except for row-level UPDATE events.';


--
-- Name: COLUMN logged_actions.statement_only; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_actions.statement_only IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';


--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE; Schema: audit; Owner: postgres
--

CREATE SEQUENCE logged_actions_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE logged_actions_event_id_seq OWNER TO postgres;

--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: postgres
--

ALTER SEQUENCE logged_actions_event_id_seq OWNED BY logged_actions.event_id;


--
-- Name: logged_relations; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE logged_relations (
    relation_name text NOT NULL,
    uid_column text NOT NULL
);


ALTER TABLE logged_relations OWNER TO postgres;

--
-- Name: TABLE logged_relations; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON TABLE logged_relations IS 'Table used to store unique identifier columns for table or views, so that events can be replayed';


--
-- Name: COLUMN logged_relations.relation_name; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_relations.relation_name IS 'Relation (table or view) name (with schema if needed)';


--
-- Name: COLUMN logged_relations.uid_column; Type: COMMENT; Schema: audit; Owner: postgres
--

COMMENT ON COLUMN logged_relations.uid_column IS 'Name of a column that is used to uniquely identify a row in the relation';


SET search_path = public, pg_catalog;

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

SET search_path = audit, pg_catalog;

--
-- Name: logged_actions event_id; Type: DEFAULT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY logged_actions ALTER COLUMN event_id SET DEFAULT nextval('logged_actions_event_id_seq'::regclass);


--
-- Data for Name: logged_actions; Type: TABLE DATA; Schema: audit; Owner: postgres
--

COPY logged_actions (event_id, schema_name, table_name, relid, session_user_name, action_tstamp_tx, action_tstamp_stm, action_tstamp_clk, transaction_id, application_name, client_addr, client_port, client_query, action, row_data, changed_fields, statement_only) FROM stdin;
\.


--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE SET; Schema: audit; Owner: postgres
--

SELECT pg_catalog.setval('logged_actions_event_id_seq', 1, false);


--
-- Data for Name: logged_relations; Type: TABLE DATA; Schema: audit; Owner: postgres
--

COPY logged_relations (relation_name, uid_column) FROM stdin;
\.


SET search_path = public, pg_catalog;

--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: teatime
--

COPY brands (uuid, name, url, created_at, updated_at) FROM stdin;
b7d3f77d-3f0d-456b-aeb4-9bed539db263	Simon Levelt	https://simonlevelt.nl	2017-01-26 20:48:26.631+00	2017-01-26 20:48:26.631+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: teatime
--

COPY categories (uuid, name, created_at, updated_at) FROM stdin;
5690bc49-3ba9-4912-a268-4819fb56ddc0	Black	2017-01-26 20:48:26.632+00	2017-01-26 20:48:26.632+00
d7acb5dd-c5ba-4959-8fbb-2515a48d74c4	Other	2017-01-26 20:48:26.632+00	2017-01-26 20:48:26.632+00
\.


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: teatime
--

COPY prices (uuid, amount, weight, created_at, updated_at, tea_uuid) FROM stdin;
6ec14e78-46a4-4e4a-a680-2e9aa48bb903	3.20	100	2017-01-26 20:48:26.733+00	2017-01-26 20:48:26.733+00	c13c41b2-e9c8-4524-93f9-782d6cda2cd3
12b92bfe-2905-4a0a-8697-b641947cb343	28.80	1000	2017-01-26 20:48:26.733+00	2017-01-26 20:48:26.733+00	c13c41b2-e9c8-4524-93f9-782d6cda2cd3
\.


--
-- Data for Name: steep_advices; Type: TABLE DATA; Schema: public; Owner: teatime
--

COPY steep_advices (uuid, amount, "time", temperature, created_at, updated_at, tea_uuid) FROM stdin;
2e601e5d-4fe7-4600-977b-31c0e2b1c6ba	empty	empty	empty	2017-01-26 20:48:26.734+00	2017-01-26 20:48:26.734+00	c13c41b2-e9c8-4524-93f9-782d6cda2cd3
\.


--
-- Data for Name: teas; Type: TABLE DATA; Schema: public; Owner: teatime
--

COPY teas (uuid, name, created_at, updated_at, brand_uuid, category_uuid) FROM stdin;
c13c41b2-e9c8-4524-93f9-782d6cda2cd3	Earl Grey	2017-01-26 20:48:26.703+00	2017-01-26 20:48:26.703+00	b7d3f77d-3f0d-456b-aeb4-9bed539db263	d7acb5dd-c5ba-4959-8fbb-2515a48d74c4
7586fc5b-0f98-47e7-a900-6432b7fcab2c	Zoethout	2017-02-13 19:19:18.686225+00	2017-02-13 19:19:18.686225+00	b7d3f77d-3f0d-456b-aeb4-9bed539db263	d7acb5dd-c5ba-4959-8fbb-2515a48d74c4
\.


SET search_path = audit, pg_catalog;

--
-- Name: logged_actions logged_actions_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY logged_actions
    ADD CONSTRAINT logged_actions_pkey PRIMARY KEY (event_id);


--
-- Name: logged_relations logged_relations_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY logged_relations
    ADD CONSTRAINT logged_relations_pkey PRIMARY KEY (relation_name, uid_column);


SET search_path = public, pg_catalog;

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
ALTER TABLE ONLY brands
    ADD CONSTRAINT brands_pkeyu UNIQUE (uuid);

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
ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkeyu UNIQUE (uuid);


--
-- Name: prices prices_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_pkeyu UNIQUE (uuid);


--
-- Name: steep_advices steep_advices_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY steep_advices
    ADD CONSTRAINT steep_advices_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY steep_advices
    ADD CONSTRAINT steep_advices_pkeyu UNIQUE (uuid);


--
-- Name: teas teas_name_brand_uuid_key; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_name_brand_uuid_key UNIQUE (name, brand_uuid);
ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_pkeyu UNIQUE (uuid);


--
-- Name: teas teas_pkey; Type: CONSTRAINT; Schema: public; Owner: teatime
--

ALTER TABLE ONLY teas
    ADD CONSTRAINT teas_pkey PRIMARY KEY (uuid);


SET search_path = audit, pg_catalog;

--
-- Name: logged_actions_action_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX logged_actions_action_idx ON logged_actions USING btree (action);


--
-- Name: logged_actions_action_tstamp_tx_stm_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX logged_actions_action_tstamp_tx_stm_idx ON logged_actions USING btree (action_tstamp_stm);


--
-- Name: logged_actions_relid_idx; Type: INDEX; Schema: audit; Owner: postgres
--

CREATE INDEX logged_actions_relid_idx ON logged_actions USING btree (relid);


SET search_path = public, pg_catalog;

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

CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP INDEX IF EXISTS brands_name_idx;
CREATE INDEX brands_name_idx ON brands USING gist (name gist_trgm_ops);

CREATE OR REPLACE FUNCTION get_brands_for_autocomplete(search varchar) RETURNS SETOF brands AS $$
	SELECT *
	FROM brands
	ORDER BY similarity(name, search) DESC, name ASC;
$$ LANGUAGE SQL STABLE;

DROP INDEX IF EXISTS categories_name_idx;
CREATE INDEX categories_name_idx ON categories USING gist (name gist_trgm_ops);

CREATE OR REPLACE FUNCTION get_categories_for_autocomplete(search varchar) RETURNS SETOF categories AS $$
	SELECT *
	FROM categories
	ORDER BY similarity(name, search) DESC, name ASC;
$$ LANGUAGE SQL STABLE;
