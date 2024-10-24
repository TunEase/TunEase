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
    description text,>
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


CREATE TABLE services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INT NOT NULL, -- Duration in minutes
   start_time time not null,
  end_time time not null,
    reordering VARCHAR(20) CHECK (reordering IN ('CUSTOM', 'AUTOMATED')) NOT NULL,
    business_id uuid REFERENCES business (id) ON DELETE CASCADE,
    service_type VARCHAR(20) CHECK (service_type IN ('PUBLIC', 'PRIVATE')) NOT NULL,
    processing_time VARCHAR(50), -- New field for processing time
    disable_availability BOOLEAN DEFAULT FALSE, -- New field for availability status
    disable_service BOOLEAN DEFAULT FALSE, -- New field for service status
    accept_cash BOOLEAN DEFAULT FALSE, -- New field for cash acceptance
    accept_card BOOLEAN DEFAULT FALSE, -- New field for card acceptance
    accept_online BOOLEAN DEFAULT FALSE, -- New field for online payment acceptance
    accept_cheque BOOLEAN DEFAULT FALSE, -- New field for cheque acceptance
    accept_notification BOOLEAN DEFAULT FALSE, -- New field for notification acceptance
    accept_complaint BOOLEAN DEFAULT FALSE, -- New field for complaint acceptance
    accept_review BOOLEAN DEFAULT FALSE, -- New field for review acceptance
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
CREATE TABLE fees (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee DECIMAL(10, 2) NOT NULL, -- Fee amount
    name VARCHAR(255) NOT NULL, -- Fee name
    description TEXT, -- Fee description
    service_id uuid REFERENCES services (id) ON DELETE CASCADE, -- Reference to the service
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
CREATE TABLE eligibility (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- Eligibility name
    description TEXT, -- Eligibility description
    service_id uuid REFERENCES services (id) ON DELETE CASCADE, -- Reference to the service
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
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

create table availability (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services (id) on delete cascade,
  currentdate date not null,
  start_time time not null,
  end_time time not null,
  days_of_week integer[] not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
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

CREATE TABLE media (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_profile_id uuid REFERENCES user_profile (id) ON DELETE CASCADE,
    business_id uuid REFERENCES business (id) ON DELETE CASCADE,
    service_id uuid REFERENCES services (id) ON DELETE CASCADE,
    complaint_id uuid REFERENCES complaints (id) ON DELETE CASCADE,
    review_id uuid REFERENCES reviews (id) ON DELETE CASCADE,
    fee_id uuid REFERENCES fees (id) ON DELETE CASCADE, -- New field for fee reference
    media_type VARCHAR(50) NOT NULL DEFAULT 'image', -- Default to 'image'
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now() -- New field for tracking updates
);
create table
  favorites (
    id uuid primary key default uuid_generate_v4 (),
    user_profile_id uuid not null references user_profile (id) on delete cascade,
    service_id uuid not null references services (id) on delete cascade,
    created_at timestamp default now(),
    unique (user_profile_id, service_id) -- Ensure that a user can only favorite a service once
  );



-- ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
-- DROP POLICY "Users can view and update their own profile" ON "user";
-- DROP TRIGGER on_auth_user_created ON auth.users;
-- DROP FUNCTION public.handle_new_user;
