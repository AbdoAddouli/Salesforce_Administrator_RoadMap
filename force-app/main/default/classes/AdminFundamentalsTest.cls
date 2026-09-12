/*
 * ____  _                 _   ___                           __        _______        _       _                 _            _
 * / ___|| |__   ___  _ __ | |_| __ ) _   _  _   _ _ __   _ _ \ \      / / ___|  __ _| |_ ___ _ __  ___  ___ | |_    __ _| |_ ___  __ _ _ __
 * \___ \| '_ \ / _ \| '_ \| __|  _ \| | | || | | | '_ \ | ' \ \ /\ / /\___ \ / _` | __/ _ \ '_ \/  __|/ _ \| __| _/ _` | __/ _ \/ _` | '_ \
 *  ___) | | | | (_) | | | | |_| |_) | |_| || |_| | | | | | | | \ V  V /  ___) | (_| | ||  __/ | | \__ \ (_) | |_ _| (_| | ||  __/ (_| | | | |
 * |____/|_| |_|\___/|_| |_|\__|____/ \__, | \__,_|_| |_| |_| |_| \_/\_/  |____/ \__,_|\__\___|_| |_|___/ \___/ \__(_) \__,_|\__\___|\__,_|_| |_|
 *                                    |___/
 *
 * ADMIN FUNDAMENTALS TEST
 *
 * LEARNING FOCUS: Phase 1, Week 1-2 - Admin basics and how the Apex test
 * harness works: @isTest, @TestSetup, System.assert and DML handlers.
 *
 *  WHY IT MATTERS: this test class is a mini boot camp. Run it first to see a
 *  green result bar - the same bar every service test in this repo should show.
 */
@isTest
private class AdminFundamentalsTest {
  @TestSetup
  static void setup() {
    List<Account> accounts = new List<Account>();
    for (Integer i = 0; i < 5; i++) {
      accounts.add(new Account(Name = 'Fundamentals Account ' + i, Description = 'seed data'));
    }
    insert accounts;
  }

  @isTest
  static void testSetupDataCreated() {
    System.assertEquals(
      5,
      [SELECT COUNT() FROM Account WHERE Name LIKE 'Fundamentals Account%'],
      'The @TestSetup block must insert its seed data exactly once.'
    );
  }

  @isTest
  static void testAsyncDmlInsideATest() {
    // DML in the test method is a separate transaction from @TestSetup.
    delete [SELECT Id FROM Account WHERE Name LIKE 'Fundamentals Account%'];
    System.assertEquals(
      0,
      [SELECT COUNT() FROM Account WHERE Name LIKE 'Fundamentals Account%'],
      'Deleting inside the test method must not leak into the shared setup.'
    );
  }

  @isTest
  static void testBulkInsertStaysUnderDmlLimit() {
    List<Contact> contacts = new List<Contact>();
    for (Integer i = 0; i < 200; i++) {
      contacts.add(new Contact(FirstName = 'Bulk', LastName = 'Contact ' + i));
    }
    insert contacts;

    System.assert(Limits.getDmlStatements() < 5, 'A single bulk insert is one DML statement.');
    System.assertEquals(200, [SELECT COUNT() FROM Contact WHERE LastName LIKE 'Bulk Contact%']);
  }

  @isTest
  static void testRollbackViaSavepoint() {
    Savepoint sp = Database.setSavepoint();
    insert new Account(Name = 'Rollback Account');
    System.assertEquals(
      1,
      [SELECT COUNT() FROM Account WHERE Name = 'Rollback Account'],
      'Savepoint lets us confirm the insert happened.'
    );
    Database.rollback(sp);
    System.assertEquals(
      0,
      [SELECT COUNT() FROM Account WHERE Name = 'Rollback Account'],
      'Rollback must revert DML performed after the savepoint.'
    );
  }
}