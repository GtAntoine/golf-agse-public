/*
  # Add test data

  1. Test Data
    - Adds 5 sample membership applications with varied data
    - Includes different membership types and license types
    - Uses realistic French names and addresses
*/

INSERT INTO membership_applications 
(email, firstname, lastname, address, postalcode, city, birthdate, phone, emergencycontact, emergencyphone, membershiptype, ffglicense, golfindex, licensetype, created_at)
VALUES
('pierre.dupont@email.com', 'Pierre', 'Dupont', '15 rue des Lilas', '75015', 'Paris', '1980-05-15', '0612345678', 'Marie Dupont', '0687654321', 'GOLF', '1234567', 15.4, 'adult', NOW() - INTERVAL '2 days'),
('sophie.martin@email.com', 'Sophie', 'Martin', '8 avenue Victor Hugo', '69002', 'Lyon', '1992-09-23', '0623456789', 'Paul Martin', '0698765432', 'GOLF_LOISIR', NULL, NULL, 'young-adult', NOW() - INTERVAL '1 day'),
('lucas.bernard@email.com', 'Lucas', 'Bernard', '25 boulevard de la Liberté', '33000', 'Bordeaux', '2010-03-10', '0634567890', 'Anne Bernard', '0609876543', 'GOLF_JEUNE', '7654321', 28.5, 'teen', NOW() - INTERVAL '12 hours'),
('emma.petit@email.com', 'Emma', 'Petit', '12 rue de la République', '13001', 'Marseille', '2015-11-30', '0645678901', 'Thomas Petit', '0610987654', 'GOLF_JEUNE', NULL, NULL, 'child', NOW() - INTERVAL '6 hours'),
('marc.leroy@email.com', 'Marc', 'Leroy', '5 place Bellecour', '69002', 'Lyon', '1975-07-20', '0656789012', 'Julie Leroy', '0621098765', 'GOLF', '9876543', 8.2, 'adult', NOW() - INTERVAL '1 hour');