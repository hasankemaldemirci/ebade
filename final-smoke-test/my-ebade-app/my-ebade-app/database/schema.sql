-- ebade Generated Database Schema

-- Table: Organization
CREATE TABLE IF NOT EXISTS organization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  plan VARCHAR(50) NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table: User
CREATE TABLE IF NOT EXISTS user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table: Event
CREATE TABLE IF NOT EXISTS event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(255) NOT NULL,
  properties JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table: ApiKey
CREATE TABLE IF NOT EXISTS api_key (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table: Invitation
CREATE TABLE IF NOT EXISTS invitation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  role VARCHAR(50) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: AuditLog
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(255) NOT NULL,
  resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);