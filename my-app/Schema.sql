CREATE TABLE user_profile (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('ADMIN', 'CLIENT', 'BUSINESS_MANAGER')),
    phone VARCHAR(255),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

create table
   business (
    id uuid primary key default uuid_generate_v4 (),
    name varchar(255) not null,
    description text,
    address varchar(255) not null,
    longitude double precision,
    latitude double precision,
    business_type varchar(20) check (business_type in ('PUBLIC', 'PRIVATE')) not null,
    manager_id uuid references user_profile (id) on delete set null,
    phone varchar(255),
    email varchar(255),
    created_at timestamp default now(),
    updated_at timestamp default now()
  );


create table
  services (
    id uuid primary key default uuid_generate_v4 (),
    name varchar(255) not null,
    description text,
    price decimal(10, 2),
    duration int not null, -- Duration in minutes
    reordering varchar(20) check (reordering in ('CUSTOM', 'AUTOMATED')) not null,
    business_id uuid references business (id) on delete cascade,
    service_type varchar(20) check (service_type in ('PUBLIC', 'PRIVATE')) not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
  );

create table
  appointments (
    id uuid primary key default uuid_generate_v4 (),
    service_id uuid references services (id) on delete cascade,
    client_id uuid references user_profile (id) on delete cascade,
    date DATE not null,
    start_time time not null,
    end_time time not null,
    status varchar(20) check (status in ('SCHEDULED', 'COMPLETED', 'CANCELLED')) not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
  );

create table
  q_and_a (
    id uuid primary key default uuid_generate_v4 (),
    service_id uuid references services (id) on delete cascade,
    question text not null,
    answer text,
    created_at timestamp default now(),
    answered_at timestamp
  );

create table
  availability (
    id uuid primary key default uuid_generate_v4 (),
    service_id uuid references services (id) on delete cascade,
    day_of_week varchar(20) check (
      day_of_week in (
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY'
      )
    ) not null,
    start_time time not null,
    end_time time not null
  );

create table
  complaints (
    id uuid primary key default uuid_generate_v4 (),
    complainant_id uuid references user_profile (id) on delete cascade,
    business_id uuid references business (id) on delete cascade,
    service_id uuid references services (id) on delete cascade,
    description text not null,
    status varchar(20) check (status in ('PENDING', 'RESOLVED', 'DISMISSED')) default 'PENDING',
    created_at timestamp default now(),
    resolved_at timestamp,
    resolution_note text,
    assigned_to uuid references user_profile (id) -- Could be Admin or Business Manager
  );

create table
  reviews (
    id uuid primary key default uuid_generate_v4 (),
    client_id uuid references user_profile (id) on delete cascade,
    service_id uuid references services (id) on delete cascade,
    business_id uuid references business (id) on delete cascade,
    rating int check (
      rating >= 1
      and rating <= 5
    ) not null,
    comment text,
    created_at timestamp default now()
  );

create table
  notifications (
    id uuid primary key default uuid_generate_v4 (),
    user_id uuid references user_profile (id) on delete cascade,
    message text not null,
    is_read boolean default false,
    created_at timestamp default now()
  );

CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio', 'document');

create table
  media (
    id uuid primary key default uuid_generate_v4 (),
    user_profile_id uuid references user_profile (id) on delete cascade,
    business_id uuid references business (id) on delete cascade,
    service_id uuid references services (id) on delete cascade,
    complaint_id uuid references complaints (id) on delete cascade,
    review_id uuid references reviews (id) on delete cascade,
    media_type varchar(50) not null default 'image', -- Default to 'image'
    media_url text not null,
    created_at timestamp default now()
  );
CREATE TABLE favorites (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_profile_id uuid NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (user_id, service_id) -- Ensure that a user can only favorite a service once
);




-- ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
-- DROP POLICY "Users can view and update their own profile" ON "user";
-- DROP TRIGGER on_auth_user_created ON auth.users;
-- DROP FUNCTION public.handle_new_user;
