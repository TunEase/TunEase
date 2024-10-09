-- Create trigger function to set manager_id to auth.uid()
CREATE OR REPLACE FUNCTION set_manager_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.manager_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert on the business table
CREATE TRIGGER before_insert_business
BEFORE INSERT ON business
FOR EACH ROW
EXECUTE FUNCTION set_manager_id();




-- Create trigger function to set client_id to auth.uid()
CREATE OR REPLACE FUNCTION set_client_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.client_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert on the appointments table
CREATE TRIGGER before_insert_appointments
BEFORE INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION set_client_id();


-- Create trigger function to set complainant_id to auth.uid()
CREATE OR REPLACE FUNCTION set_complainant_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.complainant_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert on the complaints table
CREATE TRIGGER before_insert_complaints
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION set_complainant_id();


-- Services table: Automatically assign business_id to auth.uid()
CREATE OR REPLACE FUNCTION set_business_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.business_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_services
BEFORE INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION set_business_id();
