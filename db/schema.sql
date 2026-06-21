-- Infistyle India Supabase Schema
-- Create this in the SQL Editor in Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
-- Syncs with Supabase Auth auth.users via triggers
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  phone text,
  is_admin boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Allow public read access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  category text not null,
  base_price numeric(10,2) not null,
  options_json jsonb default '{}'::jsonb, -- e.g. custom dimensions, paper weights
  images text[] default array[]::text[],  -- URLs to placeholder or generated images
  features text[] default array[]::text[], -- Feature bullet points
  rating numeric(2,1) default 4.5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Products
alter table public.products enable row level security;

create policy "Allow public read access to products" on public.products
  for select using (true);

create policy "Allow admins to manage products" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 3. DESIGNS
create table public.designs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  canvas_json jsonb default '{}'::jsonb, -- holds front & back editor layer states
  front_url text, -- rendered snapshot image of front
  back_url text,  -- rendered snapshot image of back
  qr_data text,   -- embedded QR code data
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Designs
alter table public.designs enable row level security;

create policy "Allow users to view their own designs" on public.designs
  for select using (auth.uid() = user_id);

create policy "Allow users to insert their own designs" on public.designs
  for insert with check (auth.uid() = user_id);

create policy "Allow users to update their own designs" on public.designs
  for update using (auth.uid() = user_id);

create policy "Allow users to delete their own designs" on public.designs
  for delete using (auth.uid() = user_id);

-- 4. CART ITEMS
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  design_id uuid references public.designs(id) on delete set null,
  options_json jsonb default '{}'::jsonb, -- selected configuration options (Corners, Finish, Speed, Qty)
  qty integer not null default 1,
  unit_price numeric(10,2) not null,
  file_url text, -- uploaded custom PDF or image file
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Cart Items
alter table public.cart_items enable row level security;

create policy "Allow users to manage their own cart items" on public.cart_items
  for all using (auth.uid() = user_id);

-- 5. ADDRESSES
create table public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  lat numeric(10,8),
  lng numeric(11,8),
  formatted text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Addresses
alter table public.addresses enable row level security;

create policy "Allow users to manage their own addresses" on public.addresses
  for all using (auth.uid() = user_id);

-- 6. ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'received', -- 'received' | 'printing' | 'shipped' | 'delivered'
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  gst numeric(10,2) not null,
  total numeric(10,2) not null,
  payment_method text not null, -- 'razorpay' | 'cod'
  address_id uuid references public.addresses(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Orders
alter table public.orders enable row level security;

create policy "Allow users to view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Allow users to create their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Allow admins to manage all orders" on public.orders
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 7. ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_name text not null,
  options_json jsonb default '{}'::jsonb,
  qty integer not null,
  unit_price numeric(10,2) not null,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Order Items
alter table public.order_items enable row level security;

create policy "Allow users to view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Allow admins to view all order items" on public.order_items
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 8. PAYMENTS
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  method text not null, -- 'razorpay' | 'cod'
  status text not null, -- 'pending' | 'success' | 'failed'
  amount numeric(10,2) not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Payments
alter table public.payments enable row level security;

create policy "Allow users to view their own payments" on public.payments
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = payments.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Allow admins to view all payments" on public.payments
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- TRIGGERS FOR PROFILE SYNCING
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Valued Customer'),
    new.email,
    false -- defaults to regular user
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
