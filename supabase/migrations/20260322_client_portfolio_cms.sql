-- Non-destructive extension for an existing MSNSS PostgreSQL/Supabase database.
alter table if exists clients add column if not exists logo_alt text;
alter table if exists clients add column if not exists website_url text;
alter table if exists clients add column if not exists industry varchar(160);
alter table if exists clients add column if not exists location varchar(255);
alter table if exists clients add column if not exists description text;
alter table if exists clients add column if not exists featured boolean not null default false;
alter table if exists clients add column if not exists updated_at timestamp not null default now();

alter table if exists projects add column if not exists client_id integer;
alter table if exists projects add column if not exists region varchar(80);
alter table if exists projects add column if not exists industry varchar(160);
alter table if exists projects add column if not exists year integer;
alter table if exists projects add column if not exists short_description text;
alter table if exists projects add column if not exists services_used jsonb not null default '[]'::jsonb;
alter table if exists projects add column if not exists featured boolean not null default false;
alter table if exists projects add column if not exists updated_at timestamp not null default now();

alter table if exists inquiries add column if not exists archived boolean not null default false;

create table if not exists project_images (
 id serial primary key, project_id integer not null references projects(id) on delete cascade,
 image_url text not null, title varchar(255), alt_text text not null, description text,
 sort_order integer not null default 0, created_at timestamp not null default now()
);
create index if not exists project_images_project_idx on project_images(project_id,sort_order);

create table if not exists inquiry_notes (
 id serial primary key, inquiry_id integer not null references inquiries(id) on delete cascade,
 note text not null, created_by integer references admin_users(id) on delete set null,
 created_at timestamp not null default now()
);
create index if not exists inquiry_notes_inquiry_idx on inquiry_notes(inquiry_id,created_at);

create table if not exists catalogues (
 id serial primary key, title varchar(255) not null, description text, file_url text not null,
 file_name varchar(255) not null, active boolean not null default false,
 download_count integer not null default 0, created_at timestamp not null default now(), updated_at timestamp not null default now()
);
create unique index if not exists one_active_catalogue on catalogues(active) where active=true;

create table if not exists catalogue_leads (
 id serial primary key, catalogue_id integer references catalogues(id) on delete set null,
 name varchar(255) not null, company varchar(255), email varchar(255) not null,
 phone varchar(60) not null, source varchar(80) not null default 'catalogue', created_at timestamp not null default now()
);
create index if not exists catalogue_leads_created_idx on catalogue_leads(created_at desc);

-- Add the client FK only when it is not already present.
do $$ begin
 if not exists (select 1 from pg_constraint where conname='projects_client_id_clients_id_fk') then
  alter table projects add constraint projects_client_id_clients_id_fk foreign key (client_id) references clients(id) on delete set null;
 end if;
end $$;
